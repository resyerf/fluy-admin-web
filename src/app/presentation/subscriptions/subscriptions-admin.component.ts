import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { BillingRepository } from '../../application/billing/billing-repository.port';
import { Plan } from '../../domain/billing/plan.model';
import { Subscription } from '../../domain/billing/subscription.model';

const SIGNAL_BY_SUBSCRIPTION_STATUS: Record<string, string> = {
  Trial: 'is-amber',
  Active: 'is-go',
  PastDue: 'is-amber',
  Suspended: 'is-stop',
  Cancelled: 'is-stop',
  Expired: 'is-stop'
};

@Component({
  selector: 'app-subscriptions-admin',
  standalone: true,
  imports: [DatePipe, MatButtonModule, MatCardModule, MatFormFieldModule, MatProgressSpinnerModule, MatSelectModule, MatTableModule],
  templateUrl: './subscriptions-admin.component.html',
  styleUrl: './subscriptions-admin.component.scss'
})
export class SubscriptionsAdminComponent {
  private readonly billingRepository = inject(BillingRepository);

  protected readonly loading = signal(true);
  protected readonly subscriptions = signal<Subscription[]>([]);
  protected readonly plans = signal<Plan[]>([]);
  protected readonly columns = ['tenant', 'plan', 'status', 'startDate', 'trialEndsAt', 'actions'];
  protected readonly signalByStatus = SIGNAL_BY_SUBSCRIPTION_STATUS;
  protected readonly actingOn = signal<string | null>(null);

  constructor() {
    this.load();
    this.billingRepository.getPlans().subscribe({ next: (plans) => this.plans.set(plans) });
  }

  changePlan(subscription: Subscription, newPlanCode: string): void {
    this.actingOn.set(subscription.id);
    this.billingRepository.changePlan(subscription.id, newPlanCode).subscribe({
      next: () => {
        this.actingOn.set(null);
        this.load();
      },
      error: () => this.actingOn.set(null)
    });
  }

  cancel(subscription: Subscription): void {
    this.actingOn.set(subscription.id);
    this.billingRepository.cancelSubscription(subscription.id).subscribe({
      next: () => {
        this.actingOn.set(null);
        this.load();
      },
      error: () => this.actingOn.set(null)
    });
  }

  private load(): void {
    this.loading.set(true);
    this.billingRepository.getSubscriptions().subscribe({
      next: (subscriptions) => {
        this.subscriptions.set(subscriptions);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
