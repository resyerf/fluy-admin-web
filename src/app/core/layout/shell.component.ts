import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../auth/auth.service';

interface NavLink {
  path: string;
  label: string;
  icon: string;
}

const NAV_LINKS: NavLink[] = [
  { path: '/tenants', label: 'Tenants', icon: 'domain' },
  { path: '/plans', label: 'Planes', icon: 'sell' },
  { path: '/subscriptions', label: 'Suscripciones', icon: 'receipt_long' },
  { path: '/invoices', label: 'Facturas', icon: 'request_quote' },
  { path: '/usage', label: 'Usage', icon: 'monitoring' },
  { path: '/platform-users', label: 'Equipo', icon: 'badge' }
];

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatToolbarModule, MatIconModule, MatSidenavModule],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss'
})
export class ShellComponent {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly navLinks = NAV_LINKS;

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
