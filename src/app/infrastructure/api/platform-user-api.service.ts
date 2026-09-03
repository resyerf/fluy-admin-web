import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PlatformUserRepository } from '../../application/platform-identity/platform-user-repository.port';
import { API_BASE_URL } from '../../core/config/api.config';
import { PlatformUser } from '../../domain/platform-identity/platform-identity.model';

@Injectable({ providedIn: 'root' })
export class PlatformUserApiService extends PlatformUserRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/api/v1/platform-users`;

  override getAll(): Observable<PlatformUser[]> {
    return this.http.get<PlatformUser[]>(this.baseUrl);
  }

  override create(email: string, fullName: string, password: string, role: string): Observable<{ platformUserId: string }> {
    return this.http.post<{ platformUserId: string }>(this.baseUrl, { email, fullName, password, role });
  }

  override updateRole(platformUserId: string, newRole: string): Observable<{ platformUserId: string; role: string }> {
    return this.http.post<{ platformUserId: string; role: string }>(`${this.baseUrl}/${platformUserId}/role`, { newRole });
  }

  override activate(platformUserId: string): Observable<{ platformUserId: string; status: string }> {
    return this.http.post<{ platformUserId: string; status: string }>(`${this.baseUrl}/${platformUserId}/activate`, {});
  }

  override deactivate(platformUserId: string): Observable<{ platformUserId: string; status: string }> {
    return this.http.post<{ platformUserId: string; status: string }>(`${this.baseUrl}/${platformUserId}/deactivate`, {});
  }
}
