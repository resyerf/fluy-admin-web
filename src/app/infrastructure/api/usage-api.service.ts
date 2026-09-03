import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UsageRepository } from '../../application/usage/usage-repository.port';
import { API_BASE_URL } from '../../core/config/api.config';
import { UsageMetric } from '../../domain/usage/usage.model';

@Injectable({ providedIn: 'root' })
export class UsageApiService extends UsageRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/api/v1/usage`;

  override getForTenant(tenantId: string, period: string | null): Observable<UsageMetric[]> {
    let params = new HttpParams();
    if (period) {
      params = params.set('period', period);
    }
    return this.http.get<UsageMetric[]>(`${this.baseUrl}/tenants/${tenantId}`, { params });
  }
}
