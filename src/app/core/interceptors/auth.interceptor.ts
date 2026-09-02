import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';

/** Adjunta el Bearer token del PlatformUser si hay sesión activa — no hay X-Tenant acá (CODE.md §9). */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  const token = auth.token();
  if (!token) {
    return next(req);
  }

  return next(req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) }));
};
