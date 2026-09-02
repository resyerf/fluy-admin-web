import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BillingRepository } from '../../application/billing/billing-repository.port';
import { API_BASE_URL } from '../../core/config/api.config';
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
}
