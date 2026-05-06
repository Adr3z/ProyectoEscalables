import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Modal } from '../../../shared/components/';
import { Rol, UsuarioForm as UsuarioFormModel } from '../../../models';
import { UsuarioService } from '../../../core/services';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [CommonModule, FormsModule, Modal],
  templateUrl: './usuario-form.html',
  styleUrl: './usuario-form.css'
})

export class UsuarioForm implements OnChanges {
  @Input()  abierto = false;
  @Output() cerrar  = new EventEmitter<void>();
  @Output() usuarioCreado = new EventEmitter<void>();

  form: { nombre: string; email: string; password: string; rol: Rol | '' } = {
    nombre: '', email: '', password: '', rol: ''
  };

  mostrarPassword = false;
  isLoading = false;
  errorMessage = '';

  constructor(private usuarioService: UsuarioService) {}

  ngOnChanges(): void {
    if (!this.abierto) {
      this.form           = { nombre: '', email: '', password: '', rol: '' };
      this.mostrarPassword = false;
      this.errorMessage    = '';
    }
  }

  seleccionarRol(rol: Rol): void {
    this.form.rol = rol;
  }

  get formularioValido(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return (
      !!this.form.nombre?.trim() &&
      !!this.form.email?.trim() &&
      emailRegex.test(this.form.email) &&
      !!this.form.password?.trim() &&
      this.form.password.length >= 6 &&
      (this.form.rol === 'Administrador' || this.form.rol === 'Empleado')
    );
  }

  guardar(): void {
    // Reset error message
    this.errorMessage = '';

    // Validación básica
    if (!this.form.nombre?.trim()) {
      this.errorMessage = 'El nombre es obligatorio';
      return;
    }

    if (!this.form.email?.trim()) {
      this.errorMessage = 'El email es obligatorio';
      return;
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.form.email)) {
      this.errorMessage = 'El email no tiene un formato válido';
      return;
    }

    if (!this.form.password?.trim()) {
      this.errorMessage = 'La contraseña es obligatoria';
      return;
    }

    if (this.form.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    if (!this.form.rol) {
      this.errorMessage = 'Debe seleccionar un rol';
      return;
    }

    // Verificar que el rol sea válido
    if (this.form.rol !== 'Administrador' && this.form.rol !== 'Empleado') {
      this.errorMessage = 'Rol inválido seleccionado';
      return;
    }

    // Si pasa todas las validaciones
    this.isLoading = true;
    const usuarioData: UsuarioFormModel = {
      nombre: this.form.nombre.trim(),
      email: this.form.email.trim().toLowerCase(),
      password: this.form.password,
      rol: this.form.rol as Rol
    };

    this.usuarioService.createUsuario(usuarioData).subscribe({
      next: (response) => {
        this.usuarioCreado.emit();
        this.cerrar.emit();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error creating usuario:', error);
        this.errorMessage = error.error?.message || 'Error al crear el usuario. Intente nuevamente.';
        this.isLoading = false;
      }
    });
  }
}