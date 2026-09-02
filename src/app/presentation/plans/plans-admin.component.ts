import { Component, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BillingRepository } from '../../application/billing/billing-repository.port';
import { Plan } from '../../domain/billing/plan.model';

@Component({
  selector: 'app-plans-admin',
  standalone: true,
  imports: [MatCardModule, MatProgressSpinnerModule],
  templateUrl: './plans-admin.component.html',
  styleUrl: './plans-admin.component.scss'
})
export class PlansAdminComponent {
  private readonly billingRepository = inject(BillingRepository);

  protected readonly loading = signal(true);
  protected readonly plans = signal<Plan[]>([]);

  constructor() {
    this.billingRepository.getPlans().subscribe({
      next: (plans) => {
        this.plans.set(plans);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
