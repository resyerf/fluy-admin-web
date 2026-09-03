import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { TenantRepository } from '../../application/tenant/tenant-repository.port';
import { Tenant } from '../../domain/tenant/tenant.model';

const SIGNAL_BY_TENANT_STATUS: Record<string, string> = {
  PendingSetup: 'is-amber',
  Active: 'is-go',
  Suspended: 'is-stop',
  Deleted: 'is-stop'
};

const STATUS_LABEL_ES: Record<string, string> = {
  PendingSetup: 'Pendiente',
  Active: 'Activo',
  Suspended: 'Suspendido',
  Deleted: 'Eliminado'
};

function statusLabelOf(status: string): string {
  return STATUS_LABEL_ES[status] ?? status;
}

@Component({
  selector: 'app-tenants-admin',
  standalone: true,
  imports: [DatePipe, RouterLink, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './tenants-admin.component.html',
  styleUrl: './tenants-admin.component.scss'
})
export class TenantsAdminComponent {
  private readonly tenantRepository = inject(TenantRepository);

  protected readonly loading = signal(true);
  protected readonly tenants = signal<Tenant[]>([]);
  protected readonly actingOn = signal<string | null>(null);
  protected readonly signalByStatus = SIGNAL_BY_TENANT_STATUS;
  protected readonly statusLabel = statusLabelOf;

  protected readonly counts = computed(() => {
    const list = this.tenants();
    return {
      active: list.filter((t) => t.status === 'Active').length,
      suspended: list.filter((t) => t.status === 'Suspended').length,
      pending: list.filter((t) => t.status === 'PendingSetup').length,
      total: list.length
    };
  });

  constructor() {
    this.load();
  }

  suspend(tenant: Tenant): void {
    this.actingOn.set(tenant.id);
    this.tenantRepository.suspendTenant(tenant.id).subscribe({
      next: () => {
        this.actingOn.set(null);
        this.load();
      },
      error: () => this.actingOn.set(null)
    });
  }

  activate(tenant: Tenant): void {
    this.actingOn.set(tenant.id);
    this.tenantRepository.activateTenant(tenant.id).subscribe({
      next: () => {
        this.actingOn.set(null);
        this.load();
      },
      error: () => this.actingOn.set(null)
    });
  }

  private load(): void {
    this.loading.set(true);
    this.tenantRepository.getTenants().subscribe({
      next: (tenants) => {
        this.tenants.set(tenants);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
