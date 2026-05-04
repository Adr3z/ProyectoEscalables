import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Paginacion, Modal } from '../../../shared/components';
import { UsuarioForm } from '../usuario-form/usuario-form';
import { Usuario } from '../../../models';
import { UsuarioService } from '../../../core/services';

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

  // Señales para el estado del componente
  modalAbierto = signal(false);
  modalConfirmarAbierto = signal(false);
  usuarioEliminarId = signal<string | null>(null);
  paginaActual = signal(1);
  porPagina = signal(5);

  usuarios = signal<Usuario[]>([]);
  isLoading = signal(false);

  //busqueda
  terminoBusqueda = signal('');
  private sub!: Subscription;

  constructor(private busquedaService: BusquedaService, private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.loadUsuarios();
    this.sub = this.busquedaService.termino$.subscribe(t => {
      this.terminoBusqueda.set(t);
      this.paginaActual.set(1);
    });
  }

  ngOnDestroy(): void { this.sub.unsubscribe(); }

  loadUsuarios(): void {
    this.isLoading.set(true);
    this.usuarioService.getUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios.set(usuarios);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading usuarios:', error);
        this.isLoading.set(false);
      }
    });
  }

  // Getters que acceden a las señales
  get usuariosFiltrados(): Usuario[] {
    const termino = this.terminoBusqueda();
    if (!termino.trim()) return this.usuarios();
    const q = termino.toLowerCase();
    return this.usuarios().filter(u =>
      u.nombre.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  }

  get usuariosPaginados(): Usuario[] {
    const inicio = (this.paginaActual() - 1) * this.porPagina();
    return this.usuariosFiltrados.slice(inicio, inicio + this.porPagina());
  }

  get totalAdmins(): number    { return this.usuarios().filter(u => u.rol === 'Administrador').length; }
  get totalEmpleados(): number { return this.usuarios().filter(u => u.rol === 'Empleado').length; }
  get totalActivos(): number   { return this.usuarios().filter(u => u.activo).length; }

  getIniciales(nombre: string): string {
    return nombre.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  }

  cambiarPagina(pagina: number): void { this.paginaActual.set(pagina); }
  abrirModal(): void  { this.modalAbierto.set(true); }
  cerrarModal(): void { this.modalAbierto.set(false); }

  onUsuarioCreado(): void {
    this.loadUsuarios();
  }

  confirmarEliminar(id: string): void {
    this.usuarioEliminarId.set(id);
    this.modalConfirmarAbierto.set(true);
  }

  cancelarEliminar(): void {
    this.usuarioEliminarId.set(null);
    this.modalConfirmarAbierto.set(false);
  }

  eliminar(): void {
    const id = this.usuarioEliminarId();
    if (id) {
      this.usuarioService.deleteUsuario(id).subscribe({
        next: () => {
          this.loadUsuarios(); // Recargar la lista
        },
        error: (error) => {
          console.error('Error deleting usuario:', error);
        }
      });
    }
    this.cancelarEliminar();
  }
}