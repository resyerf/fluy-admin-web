import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { TenantRepository } from '../../application/tenant/tenant-repository.port';
import { UsageRepository } from '../../application/usage/usage-repository.port';
import { Tenant } from '../../domain/tenant/tenant.model';
import { UsageMetric } from '../../domain/usage/usage.model';

@Component({
  selector: 'app-usage-admin',
  standalone: true,
  imports: [FormsModule, MatCardModule, MatFormFieldModule, MatProgressBarModule, MatProgressSpinnerModule, MatSelectModule],
  templateUrl: './usage-admin.component.html',
  styleUrl: './usage-admin.component.scss'
})
export class UsageAdminComponent {
  private readonly tenantRepository = inject(TenantRepository);
  private readonly usageRepository = inject(UsageRepository);

  protected readonly tenants = signal<Tenant[]>([]);
  protected readonly selectedTenantId = signal<string | null>(null);
  protected readonly loading = signal(false);
  protected readonly metrics = signal<UsageMetric[]>([]);

  constructor() {
    this.tenantRepository.getTenants().subscribe({
      next: (tenants) => {
        this.tenants.set(tenants);
        if (tenants.length > 0) {
          this.selectTenant(tenants[0].id);
        }
      }
    });
  }

  selectTenant(tenantId: string): void {
    this.selectedTenantId.set(tenantId);
    this.loading.set(true);
    this.usageRepository.getForTenant(tenantId, null).subscribe({
      next: (metrics) => {
        this.metrics.set(metrics);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  progressOf(metric: UsageMetric): number {
    const limit = Number(metric.limit);
    if (!metric.limit || metric.limit === 'unlimited' || !Number.isFinite(limit) || limit <= 0) {
      return 0;
    }
    return Math.min(100, (metric.used / limit) * 100);
  }
}
