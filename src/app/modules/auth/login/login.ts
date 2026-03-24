import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
  error           = '';

  constructor(private router: Router) {}

  onSubmit(): void {
    if (!this.form.email || !this.form.password) {
      this.error = 'Por favor completa todos los campos.';
      return;
    }
    // Mock — navega directo al admin cuando haya backend se reemplaza con authService.login()
    this.router.navigate(['/admin/catalogo']);
  }
}