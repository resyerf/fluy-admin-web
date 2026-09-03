import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { BillingRepository } from './application/billing/billing-repository.port';
import { AuthRepository } from './application/platform-identity/auth-repository.port';
import { PlatformUserRepository } from './application/platform-identity/platform-user-repository.port';
import { TenantRepository } from './application/tenant/tenant-repository.port';
import { UsageRepository } from './application/usage/usage-repository.port';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { AuthApiService } from './infrastructure/api/auth-api.service';
import { BillingApiService } from './infrastructure/api/billing-api.service';
import { PlatformUserApiService } from './infrastructure/api/platform-user-api.service';
import { TenantApiService } from './infrastructure/api/tenant-api.service';
import { UsageApiService } from './infrastructure/api/usage-api.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    { provide: AuthRepository, useClass: AuthApiService },
    { provide: TenantRepository, useClass: TenantApiService },
    { provide: BillingRepository, useClass: BillingApiService },
    { provide: PlatformUserRepository, useClass: PlatformUserApiService },
    { provide: UsageRepository, useClass: UsageApiService }
  ]
};
