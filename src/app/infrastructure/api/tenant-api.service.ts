import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TenantRepository } from '../../application/tenant/tenant-repository.port';
import { API_BASE_URL } from '../../core/config/api.config';
import { ProvisionTenantResult, Tenant } from '../../domain/tenant/tenant.model';

@Injectable({ providedIn: 'root' })
export class TenantApiService extends TenantRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/api/v1/tenants`;

  override getTenants(): Observable<Tenant[]> {
    return this.http.get<Tenant[]>(this.baseUrl);
  }

  override provisionTenant(
    name: string,
    subdomain: string,
    masterEmail: string,
    masterFullName: string,
    planCode: string | null,
    trialDays: number | null
  ): Observable<ProvisionTenantResult> {
    return this.http.post<ProvisionTenantResult>(this.baseUrl, {
      name,
      subdomain,
      masterEmail,
      masterFullName,
      planCode,
      trialDays
    });
  }

  override suspendTenant(tenantId: string): Observable<{ tenantId: string; status: string }> {
    return this.http.post<{ tenantId: string; status: string }>(`${this.baseUrl}/${tenantId}/suspend`, {});
  }

  override activateTenant(tenantId: string): Observable<{ tenantId: string; status: string }> {
    return this.http.post<{ tenantId: string; status: string }>(`${this.baseUrl}/${tenantId}/activate`, {});
  }
}
