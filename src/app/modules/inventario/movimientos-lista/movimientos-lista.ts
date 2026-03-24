import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Paginacion, Modal } from '../../../shared/components';
import { Movimiento, TipoMovimiento } from '../../../models';
import { MOVIMIENTOS_MOCK } from '../../../shared/data/mock.data';

//Búsqueda
import { Subscription } from 'rxjs';
import { BusquedaService } from '../../../core/services/busqueda.service';

@Component({
  selector: 'app-movimientos-lista',
  standalone: true,
  imports: [CommonModule, FormsModule, Paginacion, Modal],
  templateUrl: './movimientos-lista.html',
  styleUrl: './movimientos-lista.css'
})


export class MovimientosLista implements OnInit, OnDestroy {

  movimientos: Movimiento[]       = MOVIMIENTOS_MOCK;
  paginaActual                    = 1;
  porPagina                       = 5;

  //Modal editar
  modalEditarAbierto              = false;
  movimientoEditar: Movimiento | null = null;
  cantidadEditada: number | null  = null;

  //Modal confirmar eliminar
  modalConfirmarAbierto           = false;
  movimientoEliminarId: string | null = null;

  //Búsqueda
  private sub!: Subscription;
  terminoBusqueda                 = '';

  constructor(
    private busquedaService: BusquedaService,
  ) {}

  ngOnInit(): void {
    this.sub = this.busquedaService.termino$.subscribe(t => {
      this.terminoBusqueda = t;
      this.paginaActual    = 1;
    });
  }

  ngOnDestroy(): void { this.sub.unsubscribe(); }

  //--------------------------------------------

  //Filtros
  filtroEntradasActivo = false;
  filtroSalidasActivo  = false;

  toggleEntradas(): void {
    this.filtroEntradasActivo = !this.filtroEntradasActivo;
    if (this.filtroEntradasActivo) {
      this.filtroSalidasActivo = false;
    }
    this.paginaActual = 1;
  }

  toggleSalidas(): void {
    this.filtroSalidasActivo = !this.filtroSalidasActivo;
    if (this.filtroSalidasActivo) {
      this.filtroEntradasActivo = false;
    }
    this.paginaActual = 1;
  }

  get movimientosFiltrados(): Movimiento[] {
    let lista = this.movimientos;

    if (this.filtroEntradasActivo) {
      lista = lista.filter(m => m.tipo === 'ENTRADA');
    }

    if (this.filtroSalidasActivo) {
      lista = lista.filter(m => m.tipo === 'SALIDA');
    }

    if (this.terminoBusqueda.trim()) {
      const q = this.terminoBusqueda.toLowerCase();
      lista = lista.filter(m =>
        m.producto?.nombre.toLowerCase().includes(q) ||
        m.producto?.categoria?.nombre.toLowerCase().includes(q)
      );
    }

    return lista.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  }

  get movimientosPaginados(): Movimiento[] {
    const inicio = (this.paginaActual - 1) * this.porPagina;
    return this.movimientosFiltrados.slice(inicio, inicio + this.porPagina);
  }

  get totalEntradas(): number { return this.movimientos.filter(m => m.tipo === 'ENTRADA').length; }
  get totalSalidas(): number  { return this.movimientos.filter(m => m.tipo === 'SALIDA').length; }
  get unidadesEntradas(): number { return this.movimientos.filter(m => m.tipo === 'ENTRADA').reduce((acc, m) => acc + m.cantidad, 0); }
  get unidadesSalidas(): number  { return this.movimientos.filter(m => m.tipo === 'SALIDA').reduce((acc, m) => acc + m.cantidad, 0); }

  cambiarPagina(pagina: number): void { this.paginaActual = pagina; }

  //Editar
  abrirEditar(mov: Movimiento): void {
    this.movimientoEditar  = mov;
    this.cantidadEditada   = mov.cantidad;
    this.modalEditarAbierto = true;
  }

  cerrarEditar(): void {
    this.movimientoEditar   = null;
    this.cantidadEditada    = null;
    this.modalEditarAbierto = false;
  }

  guardarEdicion(): void {
    if (this.movimientoEditar && this.cantidadEditada !== null) {
      this.movimientos = this.movimientos.map(m =>
        m._id === this.movimientoEditar!._id
          ? { ...m, cantidad: this.cantidadEditada! }
          : m
      );
    }
    this.cerrarEditar();
  }

  //Eliminar
  confirmarEliminar(id: string): void {
    this.movimientoEliminarId  = id;
    this.modalConfirmarAbierto = true;
  }

  cancelarEliminar(): void {
    this.movimientoEliminarId  = null;
    this.modalConfirmarAbierto = false;
  }

  eliminar(): void {
    if (this.movimientoEliminarId) {
      this.movimientos = this.movimientos.filter(m => m._id !== this.movimientoEliminarId);
    }
    this.cancelarEliminar();
  }
}