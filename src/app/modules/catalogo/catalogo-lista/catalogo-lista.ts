import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeStock, Paginacion, Modal  } from '../../../shared/components';
import { Producto, Categoria, EstadoStock } from '../../../models';
import { PRODUCTOS_MOCK, CATEGORIAS_PRINCIPALES, SUBCATEGORIAS_PASTELES } from '../../../shared/data/mock.data';
import { CatalogoForm } from '../catalogo-form/catalogo-form';
import { getEstadoStock } from '../../../shared/utils/stock.utils';
import { CategoriaForm } from '../categoria-form/categoria-form';

//Búsqueda
import { Subscription } from 'rxjs';
import { BusquedaService } from '../../../core/services/busqueda.service';

type Pestaña = 'productos' | 'categorias';

@Component({
  selector: 'app-catalogo-lista',
  standalone: true,
  imports: [CommonModule, BadgeStock, Paginacion, CatalogoForm, Modal, CategoriaForm],
  templateUrl: './catalogo-lista.html',
  styleUrl: './catalogo-lista.css'
})


export class CatalogoLista implements OnInit, OnDestroy {

  pestanaActiva: Pestaña = 'productos';

  //Productos------------
  //Modal de edición
  modalProductoAbierto    = false;
  productoEditar: Producto | null = null;
  //Modal de eliminación
  modalEliminacionAbierto = false;
  productoEliminarId: string | null = null;
  //Filtros
  categoriaActivaId: string | null = null;
  mostrarSubcategorias = false;
  //Paginación
  paginaActual = 1;
  porPagina = 5;

  //Categorías-------------
  modalCategoriaAbierto         = false;
  modalConfirmarCatAbierto      = false;
  categoriaEditar: Categoria | null  = null;
  categoriaEliminarId: string | null = null;
  paginaCatActual = 1;

  //Mockdata
  productos: Producto[]              = PRODUCTOS_MOCK;
  categoriasPrincipales: Categoria[] = [...CATEGORIAS_PRINCIPALES];
  subcategoriasPasteles: Categoria[] = [...SUBCATEGORIAS_PASTELES];

  //Busqueda
  private sub!: Subscription;
  terminoBusqueda      = '';

  constructor(private busquedaService: BusquedaService) {}

  ngOnInit(): void {
      this.sub = this.busquedaService.termino$.subscribe(t => {
      this.terminoBusqueda = t;
      this.paginaActual    = 1;
      this.paginaCatActual = 1;
    });
  }

  ngOnDestroy(): void { this.sub.unsubscribe(); }


  //Stats
  get totalProductos(): number  { return this.productos.length; }
  get totalCategorias(): number { return this.categoriasPrincipales.length;  }
  get bajoStock(): number       { return this.productos.filter(p =>  p.stockActual <= 10).length; }
  get valorInventario(): number { return this.productos.reduce((acc, p) => acc + p.precio * p.stockActual, 0); }

  get productosFiltrados(): Producto[] {
      let lista = this.productos;
      if (this.categoriaActivaId === 'c1') {
        lista = lista.filter(p => p.categoria?.padreId === 'c1' || p.categoriaId === 'c1');
      } else if (this.categoriaActivaId) {
        lista = lista.filter(p => p.categoriaId === this.categoriaActivaId);
      }

      if (this.terminoBusqueda.trim()) {
        const q = this.terminoBusqueda.toLowerCase();
        lista = lista.filter(p =>
          p.nombre.toLowerCase().includes(q)
        );
      }

      return lista;
  }

  get categoriasFiltradas(): Categoria[] {
    let lista = [
        ...this.categoriasPrincipales,
        ...this.subcategoriasPasteles
      ];

      if (this.terminoBusqueda.trim()) {
        const q = this.terminoBusqueda.toLowerCase();
        lista = lista.filter(c => c.nombre.toLowerCase().includes(q));
      }

      return [...lista];
  }

  get categoriasPaginadas(): Categoria[] {
    const inicio = (this.paginaCatActual - 1) * this.porPagina;
    return this.categoriasFiltradas.slice(inicio, inicio + this.porPagina);
  }

  //Slice para la página actual
  get ProductosPaginados(): Producto[] {
    const inicio = (this.paginaActual - 1) * this.porPagina;
    return this.productosFiltrados.slice(inicio, inicio + this.porPagina);
  }

  cambiarPagina(pagina: number): void {
    this.paginaActual = pagina;
  }

  cambiarPaginaCat(pagina: number): void { this.paginaCatActual = pagina; }

  getEstado(stock: number): EstadoStock {
    return getEstadoStock(stock);
  }

  getNombreCategoria(producto: Producto): string {
    const cat = producto.categoria;
    if (!cat) return '—';
    if (cat.padreId && cat.padre) return `${cat.padre.nombre} · ${cat.nombre}`;
    if (cat.padreId) return cat.nombre;
    return cat.nombre
  }

  getNombrePadre(cat: Categoria): string {
    if (!cat.padreId) return '—';
    return this.categoriasPrincipales.find(c => c._id === cat.padreId)?.nombre ?? '—';
  }

  seleccionarPrincipal(cat: Categoria): void {
    if (cat._id === 'c1') {
      this.mostrarSubcategorias = !this.mostrarSubcategorias;
      this.categoriaActivaId    = 'c1';
    } else {
      this.categoriaActivaId    = cat._id;
      this.mostrarSubcategorias = false;
    }
    this.paginaActual = 1;
  }

  seleccionarSubcategoria(cat: Categoria): void { 
    this.categoriaActivaId = cat._id; 
    this.paginaActual = 1;
  }

  limpiarFiltro(): void { 
    this.categoriaActivaId = null; 
    this.mostrarSubcategorias = false; 
    this.paginaActual = 1;
  }

  estaActiva(id: string): boolean { 
    return this.categoriaActivaId === id; 
  }

  // ── Acciones Productos ─────────────────────────────────
  abrirCrearProducto(): void             { this.productoEditar = null; this.modalProductoAbierto = true; }
  abrirEditarProducto(p: Producto): void { this.productoEditar = p;    this.modalProductoAbierto = true; }
  cerrarModalProducto(): void            { this.modalProductoAbierto = false; }

  confirmarEliminarProducto(id: string): void { this.productoEliminarId = id;   this.modalEliminacionAbierto = true; }
  cancelarEliminarProducto(): void            { this.productoEliminarId = null; this.modalEliminacionAbierto = false; }

  eliminarProducto(): void {
    if (this.productoEliminarId) {
      this.productos = this.productos.filter(p => p._id !== this.productoEliminarId);
    }
    this.cancelarEliminarProducto();
  }

  // ── Acciones Categorías ────────────────────────────────
  abrirCrearCategoria(): void              { this.categoriaEditar = null; this.modalCategoriaAbierto = true; }
  abrirEditarCategoria(c: Categoria): void { this.categoriaEditar = c;    this.modalCategoriaAbierto = true; }
  cerrarModalCategoria(): void             { this.modalCategoriaAbierto = false; }

  confirmarEliminarCategoria(id: string): void { this.categoriaEliminarId = id;   this.modalConfirmarCatAbierto = true; }
  cancelarEliminarCategoria(): void            { this.categoriaEliminarId = null; this.modalConfirmarCatAbierto = false; }

  eliminarCategoria(): void {
    if (this.categoriaEliminarId) {
      // 1. Intentar eliminar de categorías principales
      const esPrincipal = this.categoriasPrincipales.some(c => c._id === this.categoriaEliminarId);

      if (esPrincipal) {
        // Si es principal, la eliminamos y también a sus "hijos"
        this.categoriasPrincipales = this.categoriasPrincipales
          .filter(c => c._id !== this.categoriaEliminarId);
        
        this.subcategoriasPasteles = this.subcategoriasPasteles
          .filter(c => c.padreId !== this.categoriaEliminarId);
      } else {
        // 2. Si no era principal, buscamos y eliminamos directamente en subcategorías
        this.subcategoriasPasteles = this.subcategoriasPasteles
          .filter(c => c._id !== this.categoriaEliminarId);
      }
    }

    this.cancelarEliminarCategoria();
  }
}