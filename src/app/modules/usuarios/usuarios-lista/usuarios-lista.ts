import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Paginacion, Modal } from '../../../shared/components';
import { UsuarioForm } from '../usuario-form/usuario-form';
import { Usuario } from '../../../models';
import { USUARIOS } from '../../../shared/data/mock.data';

@Component({
  selector: 'app-usuarios-lista',
  standalone: true,
  imports: [CommonModule, Paginacion, Modal, UsuarioForm],
  templateUrl: './usuarios-lista.html',
  styleUrl: './usuarios-lista.css'
})

export class UsuariosLista {

  modalAbierto          = false;
  modalConfirmarAbierto = false;
  usuarioEliminarId: string | null = null;
  paginaActual = 1;
  porPagina    = 5;

  usuarios: Usuario[] = USUARIOS;

  get usuariosPaginados(): Usuario[] {
    const inicio = (this.paginaActual - 1) * this.porPagina;
    return this.usuarios.slice(inicio, inicio + this.porPagina);
  }

  get totalAdmins(): number    { return this.usuarios.filter(u => u.rol === 'Administrador').length; }
  get totalEmpleados(): number { return this.usuarios.filter(u => u.rol === 'Empleado').length; }
  get totalActivos(): number   { return this.usuarios.filter(u => u.activo).length; }

  getIniciales(nombre: string): string {
    return nombre.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  }

  cambiarPagina(pagina: number): void { this.paginaActual = pagina; }
  abrirModal(): void  { this.modalAbierto = true; }
  cerrarModal(): void { this.modalAbierto = false; }

  confirmarEliminar(id: string): void {
    this.usuarioEliminarId    = id;
    this.modalConfirmarAbierto = true;
  }

  cancelarEliminar(): void {
    this.usuarioEliminarId    = null;
    this.modalConfirmarAbierto = false;
  }

  eliminar(): void {
    if (this.usuarioEliminarId) {
      this.usuarios = this.usuarios.filter(u => u._id !== this.usuarioEliminarId);
    }
    this.cancelarEliminar();
  }
}