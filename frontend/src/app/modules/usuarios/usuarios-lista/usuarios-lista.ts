import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Paginacion, Modal } from '../../../shared/components';
import { UsuarioForm } from '../usuario-form/usuario-form';
import { Usuario } from '../../../models';
import { USUARIOS } from '../../../shared/data/mock.data';

//busqueda
import { Subscription } from 'rxjs';
import { BusquedaService } from '../../../core/services/busqueda.service';

@Component({
  selector: 'app-usuarios-lista',
  standalone: true,
  imports: [CommonModule, Paginacion, Modal, UsuarioForm],
  templateUrl: './usuarios-lista.html',
  styleUrl: './usuarios-lista.css'
})

export class UsuariosLista implements OnInit, OnDestroy {

  modalAbierto          = false;
  modalConfirmarAbierto = false;
  usuarioEliminarId: string | null = null;
  paginaActual = 1;
  porPagina    = 5;

  usuarios: Usuario[] = USUARIOS;

  //busqueda
  terminoBusqueda = '';
  private sub!: Subscription;

  constructor(private busquedaService: BusquedaService) {}

  ngOnInit(): void {
    this.sub = this.busquedaService.termino$.subscribe(t => {
      this.terminoBusqueda = t;
      this.paginaActual    = 1;
    });
  }

  ngOnDestroy(): void { this.sub.unsubscribe(); }

  get usuariosFiltrados(): Usuario[] {
    if (!this.terminoBusqueda.trim()) return this.usuarios;
    const q = this.terminoBusqueda.toLowerCase();
    return this.usuarios.filter(u =>
      u.nombre.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  }

  get usuariosPaginados(): Usuario[] {
    const inicio = (this.paginaActual - 1) * this.porPagina;
    return this.usuariosFiltrados.slice(inicio, inicio + this.porPagina);
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