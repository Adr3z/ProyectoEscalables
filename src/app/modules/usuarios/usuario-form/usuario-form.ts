import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Modal } from '../../../shared/components/';
import { Rol } from '../../../models';

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

  form: { nombre: string; email: string; password: string; rol: Rol | '' } = {
    nombre: '', email: '', password: '', rol: ''
  };

  mostrarPassword = false;

  ngOnChanges(): void {
    if (!this.abierto) {
      this.form           = { nombre: '', email: '', password: '', rol: '' };
      this.mostrarPassword = false;
    }
  }

  seleccionarRol(rol: Rol): void {
    this.form.rol = rol;
  }

  guardar(): void {
    // Aquí irá la llamada al servicio
    this.cerrar.emit();
  }
}