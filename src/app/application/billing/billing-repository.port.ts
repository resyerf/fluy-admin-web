import { Observable } from 'rxjs';
import { Plan } from '../../domain/billing/plan.model';
import { Subscription } from '../../domain/billing/subscription.model';

/** Puerto (CODE.md §5.5) — infrastructure/api lo implementa contra fluy-admin-service. Solo lectura por ahora (CODE.md §4.15). */
export abstract class BillingRepository {
  abstract getPlans(): Observable<Plan[]>;
  abstract getSubscriptions(): Observable<Subscription[]>;
}
