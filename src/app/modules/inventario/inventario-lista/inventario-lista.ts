import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeStock, Paginacion } from '../../../shared/components';
import { EntradaForm } from '../entrada-form/entrada-form';
import { Inventario, EstadoStock } from '../../../models';
import { PRODUCTOS_MOCK } from '../../../shared/data/mock.data';
import { getEstadoStock } from '../../../shared/utils/stock.utils';
import { StockForm } from '../stock-form/stock-form';

//Busqueda
import { Subscription } from 'rxjs';
import { BusquedaService } from '../../../core/services/busqueda.service';

@Component({
  selector: 'app-inventario-lista',
  standalone: true,
  imports: [CommonModule, BadgeStock, Paginacion,  EntradaForm, StockForm],
  templateUrl: './inventario-lista.html',
  styleUrl: './inventario-lista.css'
})

export class InventarioLista implements OnInit, OnDestroy {

  modalEntradaAbierto  = false;
  modalStockAbierto = false;
  inventarioEditar: Inventario | null = null;
  paginaActual  = 1;
  porPagina     = 5;

  inventario: Inventario[] = PRODUCTOS_MOCK.map((p, i) => ({
    _id:                `inv-${i + 1}`,
    productoId:         p._id,
    producto:           p,
    stockMinimo:        5,
    stockMaximo:        50,
    fechaActualizacion: new Date()
  }));

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

  //Stats
  get skusActivos(): number { 
    return this.inventario.length; 
  }

  get stockBajo(): number { 
    return this.inventario.filter(i => this.getEstado(i) === 'BAJO' || this.getEstado(i) === 'CRITICO').length; 
  }

  get movimientosHoy(): number { 
    return 42; 
  }

  get productosAgotados(): number {
    return this.inventario.filter(i => this.getEstado(i) === 'AGOTADO').length;
  }

  //Paginación
  get inventarioPaginado(): Inventario[] {
    const inicio = (this.paginaActual - 1) * this.porPagina;
    return this.inventarioFiltrado.slice(inicio, inicio + this.porPagina);
  }

  cambiarPagina(pagina: number): void { 
    this.paginaActual = pagina; 
  }

  getEstado(item: Inventario): EstadoStock {
    return getEstadoStock(item.producto?.stockActual ?? 0, item.stockMinimo);
  }

  abrirEntrada(): void  { 
    this.modalEntradaAbierto = true; 
  }

  cerrarEntrada(): void { 
    this.modalEntradaAbierto = false; 
  }

  abrirEditarStock(item: Inventario): void {
    this.inventarioEditar = item;
    this.modalStockAbierto = true;
  }

  cerrarStock(): void {
    this.modalStockAbierto = false;
  }

  guardarStock(valores: { stockMinimo: number; stockMaximo: number }): void {
    if (this.inventarioEditar) {
      this.inventario = this.inventario.map(i =>
        i._id === this.inventarioEditar!._id
          ? { ...i, ...valores, fechaActualizacion: new Date() }
          : i
      );
    }
    this.inventarioEditar = null;
  }

  //Filtros
  filtroAgotadosActivo = false;
  filtroStockBajoActivo = false;

  filtrarStockBajo(): void {
    this.filtroStockBajoActivo = !this.filtroStockBajoActivo;
    if (this.filtroStockBajoActivo) {
      this.filtroAgotadosActivo = false;
    }

    this.paginaActual = 1;
  }

  filtrarAgotados(): void {
    this.filtroAgotadosActivo = !this.filtroAgotadosActivo;

    if (this.filtroAgotadosActivo) {
      this.filtroStockBajoActivo = false;
    }

    this.paginaActual = 1;
  }

  get inventarioFiltrado(): Inventario[] {
    let resultado = this.inventario;

    //búsqueda
    if (this.terminoBusqueda.trim()) {
      const q = this.terminoBusqueda.toLowerCase();
      resultado = resultado.filter(i =>
        i.producto?.nombre.toLowerCase().includes(q) ||
        i.producto?.categoria?.nombre.toLowerCase().includes(q)
      );
    }

    //filtro stock bajo/crítico
    if (this.filtroStockBajoActivo) {
      resultado = resultado.filter(i => {
        const estado = this.getEstado(i);
        return estado === 'BAJO' || estado === 'CRITICO';
      });
    }

    //filtro agotados
    if (this.filtroAgotadosActivo) {
      resultado = resultado.filter(i => this.getEstado(i) === 'AGOTADO');
    }

    return resultado;
  }

}