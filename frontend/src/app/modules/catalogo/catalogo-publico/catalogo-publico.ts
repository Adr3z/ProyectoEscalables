import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardProducto } from '../../../shared/components';
import { Producto, Categoria } from '../../../models';
import { ProductoService, CategoriaService } from '../../../core/services';
import { TieneHijosPipe } from '../../../shared/pipes/tieneHijos';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-catalogo-publico',
  standalone: true,
  imports: [CommonModule, CardProducto, TieneHijosPipe],
  templateUrl: './catalogo-publico.html',
  styleUrl: './catalogo-publico.css'
})
export class CatalogoPublico implements OnInit {

  // ── Estado de carga (Signals) ─────────────────────────────────────────────
  cargando = signal(true);
  error = signal<string | null>(null);

  // ── Datos crudos ─────────────────────────────────────────────────────────
  productos: Producto[] = [];
  categoriasPrincipales: Categoria[] = [];
  subcategorias: Categoria[] = [];

  // ── Filtros activos (Signals) ──────────────────────────────────────────────
  categoriaActivaId = signal<string | null>(null);
  padreActivoId = signal<string | null>(null);
  termino = signal('');

  // ── Lista derivada (Signal) ──────────────────────────────────────────────
  productosFiltrados = signal<Producto[]>([]);

  // ── Helpers de UI ────────────────────────────────────────────────────────
  get mostrarSubcategorias(): boolean {
    return !!this.padreActivoId() && this.subcategoriasVisibles.length > 0;
  }

  get subcategoriasVisibles(): Categoria[] {
    const padreId = this.padreActivoId();
    return this.subcategorias.filter(s => s.padreId === padreId);
  }

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
  ) {}

  ngOnInit(): void {
    forkJoin([
      this.productoService.getProductosPublicos(),
      this.categoriaService.getCategorias(),
    ]).subscribe({
      next: ([productos, categorias]) => {
        this.productos = productos;
        this.categoriasPrincipales = categorias.filter(c => !c.padreId);
        this.subcategorias = categorias.filter(c => !!c.padreId);
        
        this.aplicarFiltros(); 
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los productos. Intenta más tarde.');
        this.cargando.set(false);
      },
    });
  }

  // ── Acciones de filtro ───────────────────────────────────────────────────

  seleccionarPrincipal(cat: Categoria): void {
    const tieneHijos = this.subcategorias.some(s => s.padreId === cat._id);

    if (tieneHijos) {
      this.padreActivoId.set(this.padreActivoId() === cat._id ? null : cat._id);
      this.categoriaActivaId.set(null);
    } else {
      this.categoriaActivaId.set(this.categoriaActivaId() === cat._id ? null : cat._id);
      this.padreActivoId.set(null);
    }

    this.aplicarFiltros();
  }

  seleccionarSubcategoria(sub: Categoria): void {
    if (this.categoriaActivaId() === sub._id) {
      // Deselecting
      this.categoriaActivaId.set(null);
      this.padreActivoId.set(null); // Limpiar el filtro padre también
    } else {
      this.categoriaActivaId.set(sub._id);
    }
    this.termino.set(''); // Limpiar el término de búsqueda
    this.aplicarFiltros();
  }

  limpiarFiltro(): void {
    this.categoriaActivaId.set(null);
    this.padreActivoId.set(null);
    this.aplicarFiltros();
  }

  onBusqueda(event: Event): void {
    const valor = (event.target as HTMLInputElement).value;
    this.termino.set(valor);
    this.aplicarFiltros();
  }

  limpiarBusqueda(): void {
    this.termino.set('');
    this.aplicarFiltros();
  }

  estaActiva(id: string): boolean {
    return this.categoriaActivaId() === id || this.padreActivoId() === id;
  }

  // ── Motor de filtrado ────────────────────────────────────────────────────

  private aplicarFiltros(): void {
    let lista = [...this.productos];
    const catId = this.categoriaActivaId();
    const padreId = this.padreActivoId();
    const busqueda = this.termino().trim().toLowerCase();

    //Filtro por categoría o padre
    if (catId) {
      lista = lista.filter(p => p.categoriaId?._id === catId);
    } else if (padreId) {
      const hijos = this.subcategorias
        .filter(s => s.padreId === padreId)
        .map(s => s._id);
      if (hijos.length > 0) {
        lista = lista.filter(p => hijos.includes(p.categoriaId?._id));
      }
    }

    //Filtro por búsqueda
    if (busqueda) {
      lista = lista.filter(p => p.nombre.toLowerCase().includes(busqueda));
    }

    //Actualizamos el Signal
    this.productosFiltrados.set(lista);
  }
}