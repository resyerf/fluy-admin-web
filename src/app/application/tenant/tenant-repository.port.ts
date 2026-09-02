import { Observable } from 'rxjs';
import { ProvisionTenantResult, Tenant } from '../../domain/tenant/tenant.model';

/** Puerto (CODE.md §5.5) — infrastructure/api lo implementa contra fluy-admin-service. */
export abstract class TenantRepository {
  abstract getTenants(): Observable<Tenant[]>;
  abstract provisionTenant(
    name: string,
    subdomain: string,
    masterEmail: string,
    masterFullName: string,
    planCode: string | null,
    trialDays: number | null
  ): Observable<ProvisionTenantResult>;
  abstract suspendTenant(tenantId: string): Observable<{ tenantId: string; status: string }>;
  abstract activateTenant(tenantId: string): Observable<{ tenantId: string; status: string }>;
}
