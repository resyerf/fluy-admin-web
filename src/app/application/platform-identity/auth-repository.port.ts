import { Observable } from 'rxjs';
import { LoginResult } from '../../domain/platform-identity/platform-identity.model';

/** Puerto (CODE.md §5.5): infrastructure/api lo implementa contra fluy-admin-service. */
export abstract class AuthRepository {
  abstract login(email: string, password: string): Observable<LoginResult>;
}
