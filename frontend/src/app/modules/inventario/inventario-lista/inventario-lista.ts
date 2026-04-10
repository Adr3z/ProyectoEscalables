import { Component, effect, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeStock, Paginacion } from '../../../shared/components';
import { EntradaForm } from '../entrada-form/entrada-form';
import { Inventario, EstadoStock, EntradaStockForm, Producto } from '../../../models';
import { getEstadoStock } from '../../../shared/utils/stock.utils';
import { StockForm } from '../stock-form/stock-form';
import { Movimiento } from '../../../models';


//Busqueda
import { Subscription } from 'rxjs';
import { BusquedaService } from '../../../core/services/busqueda.service';
import { ProductoService } from '../../../core/services/producto.service';
import { InventarioService } from '../../../core/services/inventario.service';
import { MovimientoService } from '../../../core/services/movimiento.service';

@Component({
  selector: 'app-inventario-lista',
  standalone: true,
  imports: [CommonModule, BadgeStock, Paginacion,  EntradaForm, StockForm],
  templateUrl: './inventario-lista.html',
  styleUrl: './inventario-lista.css'
})

export class InventarioLista implements OnInit, OnDestroy {

  modalEntradaAbierto  = signal(false);
  modalStockAbierto = signal(false);
  inventarioEditar = signal<Inventario | null>(null);
  paginaActual  = signal(1);
  porPagina     = signal(5);

  productos = signal<Producto[]>([]);
  inventario = signal<Inventario[]>([]);
  inventarioFiltradoSignal = signal<Inventario[]>([]);
  movimientosHoySignal = signal(0);

  //busqueda
  terminoBusqueda = signal('');
  filtroAgotadosActivo = signal(false);
  filtroStockBajoActivo = signal(false);
  private sub!: Subscription;

  constructor(
    private busquedaService: BusquedaService,
    private productoService: ProductoService,
    private inventarioService: InventarioService,
    private movimientoService: MovimientoService,
  ) {}

  private filtrosEffect = effect(() => {
    const busqueda = this.terminoBusqueda().trim().toLowerCase();
    let lista = this.inventario();

    if (busqueda) {
      lista = lista.filter(i =>
        i.producto?.nombre.toLowerCase().includes(busqueda) ||
        i.producto?.categoriaId?.nombre.toLowerCase().includes(busqueda)
      );
    }

    if (this.filtroStockBajoActivo()) {
      lista = lista.filter(i => {
        const estado = this.getEstado(i);
        return estado === 'BAJO' || estado === 'CRITICO';
      });
    }

    if (this.filtroAgotadosActivo()) {
      lista = lista.filter(i => this.getEstado(i) === 'AGOTADO');
    }

    this.inventarioFiltradoSignal.set(lista);
  });

  ngOnInit(): void {
    this.sub = this.busquedaService.termino$.subscribe(t => {
      this.terminoBusqueda.set(t);
      this.paginaActual.set(1);
    });

    this.loadProductos();
    this.loadInventario();
    this.loadMovimientosHoy();
  }

  ngOnDestroy(): void { this.sub.unsubscribe(); }

  //Stats
  get skusActivos(): number { 
    return this.inventario().length; 
  }

  get stockBajo(): number { 
    return this.inventario().filter(i => this.getEstado(i) === 'BAJO' || this.getEstado(i) === 'CRITICO').length; 
  }

  get movimientosHoy(): number { 
    return this.movimientosHoySignal(); 
  }

  get productosAgotados(): number {
    return this.inventario().filter(i => this.getEstado(i) === 'AGOTADO').length;
  }

  //Paginación
  get inventarioPaginado(): Inventario[] {
    const inicio = (this.paginaActual() - 1) * this.porPagina();
    return this.inventarioFiltrado.slice(inicio, inicio + this.porPagina());
  }

  cambiarPagina(pagina: number): void { 
    this.paginaActual.set(pagina); 
  }

  getEstado(item: Inventario): EstadoStock {
    return getEstadoStock(item.producto?.stockActual ?? 0, item.stockMinimo);
  }

  private loadProductos(): void {
    this.productoService.getProductos().subscribe({
      next: productos => this.productos.set(productos),
      error: () => this.productos.set([]),
    });
  }

  private loadInventario(): void {
    this.inventarioService.getInventario().subscribe({
      next: inventario => this.inventario.set(inventario),
      error: () => this.inventario.set([]),
    });
  }

  private loadMovimientosHoy(): void {
    this.movimientoService.getMovimientos().subscribe({
      next: movimientos => {
        const hoy = this.obtenerFechaHoy();
        const contadorHoy = movimientos.filter(mov => this.esMismoDia(new Date(mov.fecha), hoy)).length;
        this.movimientosHoySignal.set(contadorHoy);
      },
      error: () => this.movimientosHoySignal.set(0),
    });
  }

  private obtenerFechaHoy(): Date {
    const ahora = new Date();
    return new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
  }

  private esMismoDia(fecha: Date, hoy: Date): boolean {
    return fecha.getFullYear() === hoy.getFullYear() &&
           fecha.getMonth() === hoy.getMonth() &&
           fecha.getDate() === hoy.getDate();
  }

  guardarEntrada(form: EntradaStockForm): void {
    this.inventarioService.registrarEntrada(form).subscribe({
      next: () => {
        this.loadInventario();
        this.cerrarEntrada();
      },
      error: () => {
        this.loadInventario();
        this.cerrarEntrada();
      },
    });
  }

  abrirEntrada(): void  { 
    this.modalEntradaAbierto.set(true); 
  }

  cerrarEntrada(): void { 
    this.modalEntradaAbierto.set(false); 
  }

  abrirEditarStock(item: Inventario): void {
    this.inventarioEditar.set(item);
    this.modalStockAbierto.set(true);
  }

  cerrarStock(): void {
    this.modalStockAbierto.set(false);
  }

  guardarStock(valores: { stockMinimo: number; stockMaximo: number }): void {
    const registro = this.inventarioEditar();
    if (!registro) {
      return;
    }

    this.inventarioService.updateInventario(registro._id, valores).subscribe({
      next: updated => {
        this.inventario.set(this.inventario().map(i =>
          i._id === updated._id ? updated : i
        ));
        this.inventarioEditar.set(null);
      },
      error: () => {
        this.inventarioEditar.set(null);
      }
    });
  }

  //Filtros
  filtrarStockBajo(): void {
    this.filtroStockBajoActivo.set(!this.filtroStockBajoActivo());
    if (this.filtroStockBajoActivo()) {
      this.filtroAgotadosActivo.set(false);
    }

    this.paginaActual.set(1);
  }

  filtrarAgotados(): void {
    this.filtroAgotadosActivo.set(!this.filtroAgotadosActivo());

    if (this.filtroAgotadosActivo()) {
      this.filtroStockBajoActivo.set(false);
    }

    this.paginaActual.set(1);
  }

  get inventarioFiltrado(): Inventario[] {
    return this.inventarioFiltradoSignal();
  }

}