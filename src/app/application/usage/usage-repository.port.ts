import { Observable } from 'rxjs';
import { UsageMetric } from '../../domain/usage/usage.model';

/** Puerto (CODE.md §5.5) — infrastructure/api lo implementa contra fluy-admin-service. */
export abstract class UsageRepository {
  abstract getForTenant(tenantId: string, period: string | null): Observable<UsageMetric[]>;
}
