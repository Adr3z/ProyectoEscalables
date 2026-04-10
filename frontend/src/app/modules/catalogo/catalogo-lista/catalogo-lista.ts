import { Component, OnDestroy, OnInit, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeStock, Paginacion, Modal  } from '../../../shared/components';
import { Producto, Categoria, EstadoStock } from '../../../models';
import { ProductoService } from '../../../core/services/producto.service';
import { CategoriaService } from '../../../core/services/categoria.service';
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
  categoriaActivaId = signal<string | null>(null);
  mostrarSubcategorias = signal(false);
  //Paginación
  paginaActual = signal(1);
  porPagina = 5;

  //Categorías-------------
  modalCategoriaAbierto         = false;
  modalConfirmarCatAbierto      = false;
  categoriaEditar: Categoria | null  = null;
  categoriaEliminarId: string | null = null;
  paginaCatActual = signal(1);

  //Datos backend
  productos = signal<Producto[]>([]);
  categoriasPrincipales = signal<Categoria[]>([]);
  subcategoriasPasteles = signal<Categoria[]>([]);
  productosFiltradosSignal = signal<Producto[]>([]);
  categoriasFiltradasSignal = signal<Categoria[]>([]);

  //Busqueda
  private sub!: Subscription;
  terminoBusqueda = signal('');

  constructor(
    private busquedaService: BusquedaService,
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
  ) {}

  private filtrosEffect = effect(() => {
    const busqueda = this.terminoBusqueda().trim().toLowerCase();
    const categoriaId = this.categoriaActivaId();

    this.productosFiltradosSignal.set(this.filterProductos(busqueda, categoriaId));
    this.categoriasFiltradasSignal.set(this.filterCategorias(busqueda));
  });

  ngOnInit(): void {
    this.sub = this.busquedaService.termino$.subscribe(t => {
      this.terminoBusqueda.set(t);
      this.paginaActual.set(1);
      this.paginaCatActual.set(1);
    });

    this.loadProductos();
    this.loadCategorias();
  }

  ngOnDestroy(): void { this.sub.unsubscribe(); }

  private loadProductos(): void {
    this.productoService.getProductos().subscribe({
      next: productos => this.productos.set(productos),
      error: () => this.productos.set([]),
    });
  }

  private loadCategorias(): void {
    this.categoriaService.getCategorias().subscribe({
      next: categorias => {
        this.categoriasPrincipales.set(categorias.filter(c => !c.padreId));
        this.subcategoriasPasteles.set(categorias.filter(c => !!c.padreId));
      },
      error: () => {
        this.categoriasPrincipales.set([]);
        this.subcategoriasPasteles.set([]);
      },
    });
  }

  recargarProductos(): void { this.loadProductos(); }
  recargarCategorias(): void { this.loadCategorias(); }

  private tieneSubcategorias(cat: Categoria): boolean {
    return this.subcategoriasPasteles().some(s => s.padreId === cat._id);
  }

  private filterProductos(busqueda: string, categoriaId: string | null): Producto[] {
    let lista = [...this.productos()];

    if (categoriaId) {
      const hijos = this.subcategoriasPasteles().filter(s => s.padreId === categoriaId).map(s => s._id);
      lista = lista.filter(p => p.categoriaId._id === categoriaId || hijos.includes(p.categoriaId._id));
    }

    if (busqueda) {
      lista = lista.filter(p => p.nombre.toLowerCase().includes(busqueda));
    }

    return lista;
  }

  private filterCategorias(busqueda: string): Categoria[] {
    const lista = [...this.categoriasPrincipales(), ...this.subcategoriasPasteles()];
    if (!busqueda) {
      return lista;
    }

    return lista.filter(c => c.nombre.toLowerCase().includes(busqueda));
  }


  //Stats
  get totalProductos(): number  { return this.productos().length; }
  get totalCategorias(): number { return this.categoriasPrincipales().length + this.subcategoriasPasteles().length;  }
  get bajoStock(): number       { return this.productos().filter(p =>  p.stockActual <= 10).length; }
  get valorInventario(): number { return this.productos().reduce((acc, p) => acc + p.precio * p.stockActual, 0); }

  get productosFiltrados(): Producto[] {
    return this.productosFiltradosSignal();
  }

  get categoriasFiltradas(): Categoria[] {
    return this.categoriasFiltradasSignal();
  }

  get categoriasPaginadas(): Categoria[] {
    const inicio = (this.paginaCatActual() - 1) * this.porPagina;
    return this.categoriasFiltradas.slice(inicio, inicio + this.porPagina);
  }

  //Slice para la página actual
  get ProductosPaginados(): Producto[] {
    const inicio = (this.paginaActual() - 1) * this.porPagina;
    return this.productosFiltrados.slice(inicio, inicio + this.porPagina);
  }

  cambiarPagina(pagina: number): void {
    this.paginaActual.set(pagina);
  }

  cambiarPaginaCat(pagina: number): void { this.paginaCatActual.set(pagina); }

  getEstado(stock: number): EstadoStock {
    return getEstadoStock(stock);
  }

  getNombreCategoria(producto: Producto): string {
    const cat = producto.categoriaId;
    // if (!cat) return '—';
    // if (cat.padreId && cat.padre) return `${cat.padre.nombre} · ${cat.nombre}`;
    // if (cat.padreId) return cat.nombre;
    return cat.nombre
  }

  getNombrePadre(cat: Categoria): string {
    if (!cat.padreId) return '—';
    return this.categoriasPrincipales().find(c => c._id === cat.padreId)?.nombre ?? '—';
  }

  seleccionarPrincipal(cat: Categoria): void {
    const activo = this.categoriaActivaId() === cat._id;
    this.categoriaActivaId.set(activo ? null : cat._id);
    const tieneHijos = this.tieneSubcategorias(cat);
    this.mostrarSubcategorias.set(tieneHijos && !activo);
    this.paginaActual.set(1);
  }

  seleccionarSubcategoria(cat: Categoria): void {
    const activo = this.categoriaActivaId() === cat._id;
    this.categoriaActivaId.set(activo ? null : cat._id);
    this.paginaActual.set(1);
  }

  limpiarFiltro(): void {
    this.categoriaActivaId.set(null);
    this.mostrarSubcategorias.set(false);
    this.paginaActual.set(1);
  }

  estaActiva(id: string): boolean {
    const activa = this.categoriaActivaId();

  if (!activa) return false;

  if (activa === id) return true;

  const sub = this.subcategoriasPasteles().find(s => s._id === activa);

  if (sub && sub.padreId === id) {
    return true;
  }

  return false;
  }

  // ── Acciones Productos ─────────────────────────────────
  abrirCrearProducto(): void             { this.productoEditar = null; this.modalProductoAbierto = true; }
  abrirEditarProducto(p: Producto): void { this.productoEditar = p;    this.modalProductoAbierto = true; }
  cerrarModalProducto(): void            { this.modalProductoAbierto = false; }

  confirmarEliminarProducto(id: string): void { this.productoEliminarId = id;   this.modalEliminacionAbierto = true; }
  cancelarEliminarProducto(): void            { this.productoEliminarId = null; this.modalEliminacionAbierto = false; }

  eliminarProducto(): void {
    if (!this.productoEliminarId) {
      return this.cancelarEliminarProducto();
    }

    this.productoService.deleteProducto(this.productoEliminarId).subscribe({
      next: () => {
        this.loadProductos();
        this.cancelarEliminarProducto();
      },
      error: () => this.cancelarEliminarProducto(),
    });
  }

  // ── Acciones Categorías ────────────────────────────────
  abrirCrearCategoria(): void              { this.categoriaEditar = null; this.modalCategoriaAbierto = true; }
  abrirEditarCategoria(c: Categoria): void { this.categoriaEditar = c;    this.modalCategoriaAbierto = true; }
  cerrarModalCategoria(): void             { this.modalCategoriaAbierto = false; }

  confirmarEliminarCategoria(id: string): void { this.categoriaEliminarId = id;   this.modalConfirmarCatAbierto = true; }
  cancelarEliminarCategoria(): void            { this.categoriaEliminarId = null; this.modalConfirmarCatAbierto = false; }

  eliminarCategoria(): void {
    if (!this.categoriaEliminarId) {
      return this.cancelarEliminarCategoria();
    }

    this.categoriaService.deleteCategoria(this.categoriaEliminarId).subscribe({
      next: () => {
        this.loadCategorias();
        this.cancelarEliminarCategoria();
      },
      error: () => this.cancelarEliminarCategoria(),
    });
  }
}