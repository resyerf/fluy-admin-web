import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { BillingRepository } from '../../application/billing/billing-repository.port';
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
  imports: [DatePipe, MatCardModule, MatProgressSpinnerModule, MatTableModule],
  templateUrl: './subscriptions-admin.component.html',
  styleUrl: './subscriptions-admin.component.scss'
})
export class SubscriptionsAdminComponent {
  private readonly billingRepository = inject(BillingRepository);

  protected readonly loading = signal(true);
  protected readonly subscriptions = signal<Subscription[]>([]);
  protected readonly columns = ['tenant', 'plan', 'status', 'startDate', 'trialEndsAt'];
  protected readonly signalByStatus = SIGNAL_BY_SUBSCRIPTION_STATUS;

  constructor() {
    this.billingRepository.getSubscriptions().subscribe({
      next: (subscriptions) => {
        this.subscriptions.set(subscriptions);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
