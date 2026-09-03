import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BillingRepository } from '../../application/billing/billing-repository.port';
import { API_BASE_URL } from '../../core/config/api.config';
import { Invoice } from '../../domain/billing/invoice.model';
import { Plan } from '../../domain/billing/plan.model';
import { Subscription } from '../../domain/billing/subscription.model';

@Injectable({ providedIn: 'root' })
export class BillingApiService extends BillingRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/api/v1/billing`;

  override getPlans(): Observable<Plan[]> {
    return this.http.get<Plan[]>(`${this.baseUrl}/plans`);
  }

  override getSubscriptions(): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(`${this.baseUrl}/subscriptions`);
  }

  override changePlan(subscriptionId: string, newPlanCode: string): Observable<{ subscriptionId: string; planCode: string }> {
    return this.http.post<{ subscriptionId: string; planCode: string }>(
      `${this.baseUrl}/subscriptions/${subscriptionId}/change-plan`,
      { newPlanCode }
    );
  }

  override cancelSubscription(subscriptionId: string): Observable<{ subscriptionId: string; status: string }> {
    return this.http.post<{ subscriptionId: string; status: string }>(`${this.baseUrl}/subscriptions/${subscriptionId}/cancel`, {});
  }

  override getInvoices(tenantId: string | null): Observable<Invoice[]> {
    let params = new HttpParams();
    if (tenantId) {
      params = params.set('tenantId', tenantId);
    }
    return this.http.get<Invoice[]>(`${this.baseUrl}/invoices`, { params });
  }

  override issueInvoice(
    subscriptionId: string,
    totalAmount: number,
    currency: string,
    dueDate: string
  ): Observable<{ invoiceId: string; number: string; status: string }> {
    return this.http.post<{ invoiceId: string; number: string; status: string }>(`${this.baseUrl}/invoices`, {
      subscriptionId,
      totalAmount,
      currency,
      dueDate
    });
  }

  override recordPayment(
    invoiceId: string,
    amount: number,
    currency: string,
    method: string,
    reference: string | null
  ): Observable<{ paymentId: string; invoiceId: string; invoiceStatus: string }> {
    return this.http.post<{ paymentId: string; invoiceId: string; invoiceStatus: string }>(
      `${this.baseUrl}/invoices/${invoiceId}/payments`,
      { amount, currency, method, reference }
    );
  }
}
