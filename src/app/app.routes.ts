import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { ShellComponent } from './core/layout/shell.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./presentation/auth/login.component').then((m) => m.LoginComponent)
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'tenants', pathMatch: 'full' },
      {
        path: 'tenants',
        loadComponent: () => import('./presentation/tenants/tenants-admin.component').then((m) => m.TenantsAdminComponent)
      },
      {
        path: 'tenants/new',
        loadComponent: () =>
          import('./presentation/tenants/provision-tenant.component').then((m) => m.ProvisionTenantComponent)
      },
      {
        path: 'plans',
        loadComponent: () => import('./presentation/plans/plans-admin.component').then((m) => m.PlansAdminComponent)
      },
      {
        path: 'subscriptions',
        loadComponent: () =>
          import('./presentation/subscriptions/subscriptions-admin.component').then((m) => m.SubscriptionsAdminComponent)
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
