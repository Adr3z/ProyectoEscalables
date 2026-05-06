import { Component, effect, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Paginacion, Modal } from '../../../shared/components';
import { Movimiento } from '../../../models';

//Búsqueda
import { Subscription } from 'rxjs';
import { BusquedaService } from '../../../core/services/busqueda.service';
import { MovimientoService } from '../../../core/services/movimiento.service';

@Component({
  selector: 'app-movimientos-lista',
  standalone: true,
  imports: [CommonModule, FormsModule, Paginacion, Modal],
  templateUrl: './movimientos-lista.html',
  styleUrl: './movimientos-lista.css'
})


export class MovimientosLista implements OnInit, OnDestroy {

  movimientos = signal<Movimiento[]>([]);
  paginaActual = signal(1);
  porPagina = signal(5);

  //Modal editar
  modalEditarAbierto = signal(false);
  movimientoEditar = signal<Movimiento | null>(null);
  cantidadEditada = signal<number | null>(null);
  mensajeEditarError = signal<string | null>(null);

  //Modal confirmar eliminar
  modalConfirmarAbierto = signal(false);
  movimientoEliminarId = signal<string | null>(null);

  //Búsqueda
  private sub!: Subscription;
  terminoBusqueda = signal('');

  filtroEntradasActivo = signal(false);
  filtroSalidasActivo = signal(false);
  movimientosFiltradosSignal = signal<Movimiento[]>([]);

  constructor(
    private busquedaService: BusquedaService,
    private movimientoService: MovimientoService,
  ) {
    effect(() => {
      const lista = this.movimientos();
      const entradas = this.filtroEntradasActivo();
      const salidas = this.filtroSalidasActivo();
      const termino = this.terminoBusqueda().trim().toLowerCase();

      let resultado = [...lista];

      if (entradas) {
        resultado = resultado.filter(m => m.tipo === 'ENTRADA');
      }

      if (salidas) {
        resultado = resultado.filter(m => m.tipo === 'SALIDA');
      }

      if (termino) {
        resultado = resultado.filter(m => {
          const nombre = this.getNombreProducto(m).toLowerCase();
          const categoria = this.getCategoriaProducto(m).toLowerCase();
          return nombre.includes(termino) || categoria.includes(termino);
        });
      }

      this.movimientosFiltradosSignal.set(
        resultado.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      );
    });
  }

  ngOnInit(): void {
    this.sub = this.busquedaService.termino$.subscribe(t => {
      this.terminoBusqueda.set(t);
      this.paginaActual.set(1);
    });

    this.loadMovimientos();
  }

  ngOnDestroy(): void { this.sub.unsubscribe(); }

  private loadMovimientos(): void {
    this.movimientoService.getMovimientos().subscribe({
      next: movimientos => {
        this.movimientos.set(movimientos.map(mov => ({
          ...mov,
          producto: mov.productoId && typeof mov.productoId !== 'string' ? mov.productoId : undefined,
        })));
        this.paginaActual.set(1);
      },
      error: () => this.movimientos.set([]),
    });
  }

  //--------------------------------------------

  toggleEntradas(): void {
    this.filtroEntradasActivo.set(!this.filtroEntradasActivo());
    if (this.filtroEntradasActivo()) {
      this.filtroSalidasActivo.set(false);
    }
    this.paginaActual.set(1);
  }

  toggleSalidas(): void {
    this.filtroSalidasActivo.set(!this.filtroSalidasActivo());
    if (this.filtroSalidasActivo()) {
      this.filtroEntradasActivo.set(false);
    }
    this.paginaActual.set(1);
  }

  get movimientosFiltrados(): Movimiento[] {
    return this.movimientosFiltradosSignal();
  }

  get movimientosPaginados(): Movimiento[] {
    const inicio = (this.paginaActual() - 1) * this.porPagina();
    return this.movimientosFiltrados.slice(inicio, inicio + this.porPagina());
  }

  get totalEntradas(): number { return this.movimientos().filter(m => m.tipo === 'ENTRADA').length; }
  get totalSalidas(): number { return this.movimientos().filter(m => m.tipo === 'SALIDA').length; }
  get unidadesEntradas(): number { return this.movimientos().filter(m => m.tipo === 'ENTRADA').reduce((acc, m) => acc + m.cantidad, 0); }
  get unidadesSalidas(): number { return this.movimientos().filter(m => m.tipo === 'SALIDA').reduce((acc, m) => acc + m.cantidad, 0); }

  cambiarPagina(pagina: number): void { this.paginaActual.set(pagina); }

  getNombreProducto(mov: Movimiento): string {
    if (mov.nombreProducto) {
      return mov.nombreProducto;
    }

    if (mov.producto?.nombre) {
      return mov.producto.nombre;
    }
    if (mov.productoId && typeof mov.productoId !== 'string') {
      return mov.productoId.nombre;
    }
    return 'Sin producto';
  }

  getCategoriaProducto(mov: Movimiento): string {
    if (mov.producto?.categoriaId?.nombre) {
      return mov.producto.categoriaId.nombre;
    }
    if (mov.productoId && typeof mov.productoId !== 'string') {
      return mov.productoId.categoriaId?.nombre ?? '';
    }
    return '';
  }

  //Editar
  abrirEditar(mov: Movimiento): void {
    this.movimientoEditar.set(mov);
    this.cantidadEditada.set(mov.cantidad);
    this.mensajeEditarError.set(null);
    this.modalEditarAbierto.set(true);
  }

  cerrarEditar(): void {
    this.movimientoEditar.set(null);
    this.cantidadEditada.set(null);
    this.mensajeEditarError.set(null);
    this.modalEditarAbierto.set(false);
  }

  guardarEdicion(): void {
    const editar = this.movimientoEditar();
    const cantidad = this.cantidadEditada();
    if (!editar || cantidad === null) {
      return;
    }

    if (cantidad <= 0) {
      this.mensajeEditarError.set('La cantidad debe ser mayor a cero.');
      return;
    }

    this.movimientoService.updateMovimiento(editar._id, { cantidad }).subscribe({
      next: (movimientoActualizado) => {
        this.movimientos.set(this.movimientos().map(m =>
          m._id === editar._id
            ? { ...m, ...movimientoActualizado }
            : m
        ));
        this.cerrarEditar();
      },
      error: (error) => {
        const mensaje = error?.error?.message ?? 'No fue posible actualizar el movimiento.';
        this.mensajeEditarError.set(mensaje);
        console.error('Error al actualizar movimiento:', error);
      }
    });
  }

  //Eliminar
  confirmarEliminar(id: string): void {
    this.movimientoEliminarId.set(id);
    this.modalConfirmarAbierto.set(true);
  }

  cancelarEliminar(): void {
    this.movimientoEliminarId.set(null);
    this.modalConfirmarAbierto.set(false);
  }

  eliminar(): void {
    const id = this.movimientoEliminarId();
    if (id) {
      this.movimientoService.deleteMovimiento(id).subscribe({
        next: () => {
          this.movimientos.set(this.movimientos().filter(m => m._id !== id));
          this.cancelarEliminar();
        },
        error: (error) => {
          console.error('Error al eliminar movimiento:', error);
        }
      });
    }
  }
}