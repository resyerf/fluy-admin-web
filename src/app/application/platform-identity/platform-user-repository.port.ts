import { Observable } from 'rxjs';
import { PlatformUser } from '../../domain/platform-identity/platform-identity.model';

/** Puerto (CODE.md §5.5) — infrastructure/api lo implementa contra fluy-admin-service. */
export abstract class PlatformUserRepository {
  abstract getAll(): Observable<PlatformUser[]>;
  abstract create(email: string, fullName: string, password: string, role: string): Observable<{ platformUserId: string }>;
  abstract updateRole(platformUserId: string, newRole: string): Observable<{ platformUserId: string; role: string }>;
  abstract activate(platformUserId: string): Observable<{ platformUserId: string; status: string }>;
  abstract deactivate(platformUserId: string): Observable<{ platformUserId: string; status: string }>;
}
