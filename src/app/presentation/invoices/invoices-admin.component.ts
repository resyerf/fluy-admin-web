import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { BillingRepository } from '../../application/billing/billing-repository.port';
import { Invoice } from '../../domain/billing/invoice.model';
import { Subscription } from '../../domain/billing/subscription.model';

const SIGNAL_BY_INVOICE_STATUS: Record<string, string> = {
  Draft: 'is-amber',
  Issued: 'is-amber',
  Paid: 'is-go',
  PastDue: 'is-stop',
  Void: 'is-stop'
};

@Component({
  selector: 'app-invoices-admin',
  standalone: true,
  imports: [
    DatePipe,
    DecimalPipe,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTableModule
  ],
  templateUrl: './invoices-admin.component.html',
  styleUrl: './invoices-admin.component.scss'
})
export class InvoicesAdminComponent {
  private readonly billingRepository = inject(BillingRepository);

  protected readonly loading = signal(true);
  protected readonly invoices = signal<Invoice[]>([]);
  protected readonly subscriptions = signal<Subscription[]>([]);
  protected readonly columns = ['number', 'tenant', 'status', 'issueDate', 'dueDate', 'total', 'actions'];
  protected readonly signalByStatus = SIGNAL_BY_INVOICE_STATUS;

  protected readonly showIssueForm = signal(false);
  protected readonly payingOn = signal<Invoice | null>(null);
  protected readonly busy = signal<string | null>(null);

  protected issueSubscriptionId = '';
  protected issueTotalAmount: number | null = null;
  protected issueCurrency = 'USD';
  protected issueDueDate = '';

  protected paymentAmount: number | null = null;
  protected paymentMethod = 'Manual';
  protected paymentReference = '';

  constructor() {
    this.load();
    this.billingRepository.getSubscriptions().subscribe({ next: (subs) => this.subscriptions.set(subs) });
  }

  issueInvoice(): void {
    if (!this.issueSubscriptionId || !this.issueTotalAmount || !this.issueDueDate) {
      return;
    }
    this.busy.set('issue');
    this.billingRepository
      .issueInvoice(this.issueSubscriptionId, this.issueTotalAmount, this.issueCurrency, new Date(this.issueDueDate).toISOString())
      .subscribe({
        next: () => {
          this.busy.set(null);
          this.showIssueForm.set(false);
          this.issueSubscriptionId = '';
          this.issueTotalAmount = null;
          this.issueDueDate = '';
          this.load();
        },
        error: () => this.busy.set(null)
      });
  }

  startPayment(invoice: Invoice): void {
    this.payingOn.set(invoice);
    this.paymentAmount = invoice.totalAmount;
    this.paymentMethod = 'Manual';
    this.paymentReference = '';
  }

  recordPayment(): void {
    const invoice = this.payingOn();
    if (!invoice || !this.paymentAmount) {
      return;
    }
    this.busy.set(invoice.id);
    this.billingRepository
      .recordPayment(invoice.id, this.paymentAmount, invoice.currency, this.paymentMethod, this.paymentReference || null)
      .subscribe({
        next: () => {
          this.busy.set(null);
          this.payingOn.set(null);
          this.load();
        },
        error: () => this.busy.set(null)
      });
  }

  private load(): void {
    this.loading.set(true);
    this.billingRepository.getInvoices(null).subscribe({
      next: (invoices) => {
        this.invoices.set(invoices);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
