import { Observable } from 'rxjs';
import { Invoice } from '../../domain/billing/invoice.model';
import { Plan } from '../../domain/billing/plan.model';
import { Subscription } from '../../domain/billing/subscription.model';

/** Puerto (CODE.md §5.5) — infrastructure/api lo implementa contra fluy-admin-service. Reflejo local, sin proveedor de pagos (CODE.md §4.15). */
export abstract class BillingRepository {
  abstract getPlans(): Observable<Plan[]>;
  abstract getSubscriptions(): Observable<Subscription[]>;
  abstract changePlan(subscriptionId: string, newPlanCode: string): Observable<{ subscriptionId: string; planCode: string }>;
  abstract cancelSubscription(subscriptionId: string): Observable<{ subscriptionId: string; status: string }>;
  abstract getInvoices(tenantId: string | null): Observable<Invoice[]>;
  abstract issueInvoice(
    subscriptionId: string,
    totalAmount: number,
    currency: string,
    dueDate: string
  ): Observable<{ invoiceId: string; number: string; status: string }>;
  abstract recordPayment(
    invoiceId: string,
    amount: number,
    currency: string,
    method: string,
    reference: string | null
  ): Observable<{ paymentId: string; invoiceId: string; invoiceStatus: string }>;
}
