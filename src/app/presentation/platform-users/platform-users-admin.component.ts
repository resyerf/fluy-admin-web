import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { PlatformUserRepository } from '../../application/platform-identity/platform-user-repository.port';
import { PlatformUser } from '../../domain/platform-identity/platform-identity.model';

const ROLES = ['SuperAdmin', 'BillingOps', 'Support', 'ReadOnly'];
const SIGNAL_BY_STATUS: Record<string, string> = { Active: 'is-go', Disabled: 'is-stop' };

@Component({
  selector: 'app-platform-users-admin',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTableModule
  ],
  templateUrl: './platform-users-admin.component.html',
  styleUrl: './platform-users-admin.component.scss'
})
export class PlatformUsersAdminComponent {
  private readonly platformUserRepository = inject(PlatformUserRepository);

  protected readonly loading = signal(true);
  protected readonly users = signal<PlatformUser[]>([]);
  protected readonly columns = ['fullName', 'email', 'role', 'status', 'actions'];
  protected readonly roles = ROLES;
  protected readonly signalByStatus = SIGNAL_BY_STATUS;
  protected readonly actingOn = signal<string | null>(null);
  protected readonly showCreateForm = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected email = '';
  protected fullName = '';
  protected password = '';
  protected role = 'Support';

  constructor() {
    this.load();
  }

  create(): void {
    this.errorMessage.set(null);
    this.platformUserRepository.create(this.email, this.fullName, this.password, this.role).subscribe({
      next: () => {
        this.email = '';
        this.fullName = '';
        this.password = '';
        this.role = 'Support';
        this.showCreateForm.set(false);
        this.load();
      },
      error: (error) => this.errorMessage.set(error?.error?.detail ?? 'No se pudo crear el usuario.')
    });
  }

  changeRole(user: PlatformUser, newRole: string): void {
    this.actingOn.set(user.id);
    this.platformUserRepository.updateRole(user.id, newRole).subscribe({
      next: () => {
        this.actingOn.set(null);
        this.load();
      },
      error: () => this.actingOn.set(null)
    });
  }

  toggleStatus(user: PlatformUser): void {
    this.actingOn.set(user.id);
    const action$ = user.status === 'Active' ? this.platformUserRepository.deactivate(user.id) : this.platformUserRepository.activate(user.id);
    action$.subscribe({
      next: () => {
        this.actingOn.set(null);
        this.load();
      },
      error: () => this.actingOn.set(null)
    });
  }

  private load(): void {
    this.loading.set(true);
    this.platformUserRepository.getAll().subscribe({
      next: (users) => {
        this.users.set(users);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
