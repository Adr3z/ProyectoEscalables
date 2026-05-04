import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { AuthService, LoginRequest } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  form = { email: '', password: '' };
  mostrarPassword = false;
  error = signal('');
  isLoading = signal(false);
  hasRecentError = signal(false);

  constructor(private router: Router, private authService: AuthService) {}

  onInputChange(): void {
    // Limpiar error y resetear estado cuando el usuario escribe
    if (this.hasRecentError()) {
      this.error.set('');
      this.hasRecentError.set(false);
    }
  }

  onSubmit(): void {
    if (!this.form.email || !this.form.password) {
      this.error.set('Por favor completa todos los campos.');
      return;
    }

    this.isLoading.set(true);
    this.error.set('');

    const credentials: LoginRequest = {
      email: this.form.email.trim().toLowerCase(),
      password: this.form.password
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.hasRecentError.set(false);
        // Redireccionar según el rol del usuario
        const user = response.user;
        if (user.rol === 'Administrador') {
          this.router.navigate(['/admin/catalogo']);
        } else {
          this.router.navigate(['/admin/pos']);
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        this.hasRecentError.set(true);
        if (error.status === 400) {
          this.error.set('Credenciales incorrectas. Verifica tu email y contraseña.');
        } else {
          this.error.set('Error al iniciar sesión. Inténtalo de nuevo.');
        }
        console.error('Error en login:', error);
      }
    });
  }
}