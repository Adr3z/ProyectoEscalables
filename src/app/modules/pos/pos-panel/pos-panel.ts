import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Modal } from '../../../shared/components';
import { Carrito } from '../carrito/carrito';
import { CardPos } from '../card-pos/card-pos';
import { Producto, ItemCarrito, Categoria, Inventario } from '../../../models';
import { PRODUCTOS_MOCK, CATEGORIAS_PRINCIPALES, SUBCATEGORIAS_PASTELES, INVENTARIO_MOCK } from '../../../shared/data/mock.data';

//Busqueda
import { Subscription } from 'rxjs';
import { BusquedaService } from '../../../core/services/busqueda.service';

export type EstadoItemVenta = 'ok' | 'bajo-minimo' | 'insuficiente';

export interface ItemValidado {
  item: ItemCarrito;
  estado: EstadoItemVenta;
  stockTrasVenta: number;
  stockMinimo: number;
}


@Component({
  selector: 'app-pos-panel',
  standalone: true,
  imports: [CommonModule, Carrito, Modal, CardPos],
  templateUrl: './pos-panel.html',
  styleUrl: './pos-panel.css'
})


export class PosPanel implements OnInit, OnDestroy {

  productos: Producto[]              = PRODUCTOS_MOCK;
  categoriasPrincipales: Categoria[] = CATEGORIAS_PRINCIPALES;
  subcategoriasPasteles: Categoria[] = SUBCATEGORIAS_PASTELES;

  inventario: Inventario[] = INVENTARIO_MOCK;
  categoriaActivaId: string | null = null;
  mostrarSubcategorias             = false;
  busqueda                         = '';
  carrito: ItemCarrito[]           = [];
  modalConfirmarAbierto            = false;
  ventaConfirmada                  = false;

  //Busqueda
  terminoBusqueda = '';
  private sub!: Subscription;

  constructor(private busquedaService: BusquedaService) {}

  ngOnInit(): void {
    this.sub = this.busquedaService.termino$.subscribe(t => {
      this.terminoBusqueda = t;
    });
  }

  ngOnDestroy(): void { this.sub.unsubscribe(); }

  get productosFiltrados(): Producto[] {
    let lista = this.productos.filter(p => p.stockActual > 0);

    if (this.categoriaActivaId === 'c1') {
      lista = lista.filter(p => p.categoria?.padreId === 'c1' || p.categoriaId === 'c1');
    } else if (this.categoriaActivaId) {
      lista = lista.filter(p => p.categoriaId === this.categoriaActivaId);
    }

    if (this.terminoBusqueda.trim()) {
      const q = this.terminoBusqueda.toLowerCase();
      lista = lista.filter(p => p.nombre.toLowerCase().includes(q));
    }
    return lista;
  }

  seleccionarPrincipal(cat: Categoria): void {
    if (cat._id === 'c1') {
      this.mostrarSubcategorias = !this.mostrarSubcategorias;
      this.categoriaActivaId    = 'c1';
    } else {
      this.categoriaActivaId    = cat._id;
      this.mostrarSubcategorias = false;
    }
  }

  seleccionarSubcategoria(cat: Categoria): void { 
    this.categoriaActivaId = cat._id; 
  }
  
  limpiarFiltro(): void { 
    this.categoriaActivaId = null; 
    this.mostrarSubcategorias = false; 
  }

  estaActiva(id: string): boolean { 
    return this.categoriaActivaId === id; 
  }

  agregarAlCarrito(producto: Producto): void {
    const item = this.carrito.find(i => i.producto._id === producto._id);
    if (item) {
      item.cantidad++;
    } else {
      this.carrito = [...this.carrito, { producto, cantidad: 1 }];
    }
  }

  incrementar(productoId: string): void {
    const item = this.carrito.find(i => i.producto._id === productoId);
    if (item) item.cantidad++;
  }

  decrementar(productoId: string): void {
    const item = this.carrito.find(i => i.producto._id === productoId);
    if (!item) return;
    if (item.cantidad === 1) {
      this.eliminarDelCarrito(productoId);
    } else {
      item.cantidad--;
    }
  }

  eliminarDelCarrito(productoId: string): void {
    this.carrito = this.carrito.filter(i => i.producto._id !== productoId);
  }

  cancelarVenta(): void {
    this.carrito = [];
  }

  abrirConfirmar(): void  { this.modalConfirmarAbierto = true; }
  cerrarConfirmar(): void { this.modalConfirmarAbierto = false; }

  confirmarVenta(): void {
    //Aquí irá la llamada al servicio 
    this.carrito              = [];
    this.ventaConfirmada      = true;
    this.modalConfirmarAbierto = false;
    setTimeout(() => this.ventaConfirmada = false, 3000);
  }

  enCarrito(productoId: string): number {
    return this.carrito.find(i => i.producto._id === productoId)?.cantidad ?? 0;
  }


  // Validación de stock
  getStockMinimo(productoId: string): number {
    return this.inventario.find(i => i.productoId === productoId)?.stockMinimo ?? 0;
  }

  getEstadoItem(item: ItemCarrito): EstadoItemVenta {
    const stockTras = item.producto.stockActual - item.cantidad;
    if (stockTras < 0) return 'insuficiente';
    if (stockTras < this.getStockMinimo(item.producto._id)) return 'bajo-minimo';
    return 'ok';
  }

  get itemsValidados(): ItemValidado[] {
    return this.carrito.map(item => ({
      item,
      estado:         this.getEstadoItem(item),
      stockTrasVenta: item.producto.stockActual - item.cantidad,
      stockMinimo:    this.getStockMinimo(item.producto._id)
    }));
  }

  get hayInsuficiente(): boolean {
    return this.itemsValidados.some(v => v.estado === 'insuficiente');
  }

  get hayBajoMinimo(): boolean {
    return this.itemsValidados.some(v => v.estado === 'bajo-minimo');
  }
}