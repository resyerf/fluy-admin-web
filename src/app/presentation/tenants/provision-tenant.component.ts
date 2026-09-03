import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { BillingRepository } from '../../application/billing/billing-repository.port';
import { TenantRepository } from '../../application/tenant/tenant-repository.port';
import { Plan } from '../../domain/billing/plan.model';
import { ProvisionTenantResult } from '../../domain/tenant/tenant.model';

@Component({
  selector: 'app-provision-tenant',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    RouterLink,
    MatAutocompleteModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './provision-tenant.component.html',
  styleUrl: './provision-tenant.component.scss'
})
export class ProvisionTenantComponent {
  private readonly tenantRepository = inject(TenantRepository);
  private readonly billingRepository = inject(BillingRepository);
  private readonly router = inject(Router);

  protected readonly plans = signal<Plan[]>([]);
  protected readonly planQuery = signal('');
  protected readonly filteredPlans = computed(() => {
    const query = this.planQuery().trim().toLowerCase();
    const available = this.plans().filter((plan) => plan.isActive);
    if (!query) {
      return available;
    }
    return available.filter(
      (plan) => plan.code.toLowerCase().includes(query) || plan.name.toLowerCase().includes(query)
    );
  });

  protected name = '';
  protected subdomain = '';
  protected masterEmail = '';
  protected masterFullName = '';
  protected planCode = '';
  protected trialDays: number | null = null;

  protected readonly saving = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly result = signal<ProvisionTenantResult | null>(null);

  constructor() {
    this.billingRepository.getPlans().subscribe({
      next: (plans) => this.plans.set(plans)
    });
  }

  onPlanOptionSelected(event: MatAutocompleteSelectedEvent): void {
    this.planCode = event.option.value;
    this.planQuery.set(this.planCode);
  }

  onPlanQueryChange(value: string): void {
    this.planCode = value;
    this.planQuery.set(value);
  }

  provision(): void {
    this.saving.set(true);
    this.errorMessage.set(null);
    this.result.set(null);

    const planCode = this.planCode.trim() || null;
    const trialDays = this.trialDays && this.trialDays > 0 ? Math.round(this.trialDays) : null;

    this.tenantRepository.provisionTenant(this.name, this.subdomain, this.masterEmail, this.masterFullName, planCode, trialDays).subscribe({
      next: (result) => {
        this.saving.set(false);
        this.result.set(result);
      },
      error: (error) => {
        this.saving.set(false);
        this.errorMessage.set(error?.error?.detail ?? 'No se pudo aprovisionar el tenant.');
      }
    });
  }

  close(): void {
    this.router.navigate(['/tenants']);
  }
}
