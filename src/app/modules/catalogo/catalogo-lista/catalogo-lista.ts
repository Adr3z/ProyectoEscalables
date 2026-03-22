import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeStock, Paginacion, Modal  } from '../../../shared/components';
import { Producto, Categoria, EstadoStock } from '../../../models';
import { PRODUCTOS_MOCK, CATEGORIAS_PRINCIPALES, SUBCATEGORIAS_PASTELES } from '../../../shared/data/mock.data';
import { CatalogoForm } from '../catalogo-form/catalogo-form';


@Component({
  selector: 'app-catalogo-lista',
  standalone: true,
  imports: [CommonModule, BadgeStock, Paginacion, CatalogoForm, Modal],
  templateUrl: './catalogo-lista.html',
  styleUrl: './catalogo-lista.css'
})


export class CatalogoLista {

  //Modal de edición
  modalAbierto    = false;
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

  productos: Producto[]              = PRODUCTOS_MOCK;
  categoriasPrincipales: Categoria[] = CATEGORIAS_PRINCIPALES;
  subcategoriasPasteles: Categoria[] = SUBCATEGORIAS_PASTELES;

  //Stats
  get totalProductos(): number  { return this.productos.length; }
  get totalCategorias(): number { return CATEGORIAS_PRINCIPALES.length; }
  get bajoStock(): number       { return this.productos.filter(p =>  p.stockActual <= 10).length; }
  get valorInventario(): number { return this.productos.reduce((acc, p) => acc + p.precio * p.stockActual, 0); }

  get productosFiltrados(): Producto[] {
    if (!this.categoriaActivaId) return this.productos;

    if (this.categoriaActivaId === 'c1') {
      return this.productos.filter(p => p.categoria?.padreId === 'c1' || p.categoriaId === 'c1');
    }
    return this.productos.filter(p => p.categoriaId === this.categoriaActivaId);
  }

  //Slice para la página actual
  get ProductosPaginados(): Producto[] {
    const inicio = (this.paginaActual - 1) * this.porPagina;
    return this.productosFiltrados.slice(inicio, inicio + this.porPagina);
  }

  cambiarPagina(pagina: number): void {
    this.paginaActual = pagina;
  }

  getEstado(stock: number): EstadoStock {
    if (stock === 0)  return 'AGOTADO';
    if (stock <= 5)   return 'CRITICO';
    if (stock <= 10)  return 'BAJO';
    return 'SUFICIENTE';
  }

  getNombreCategoria(producto: Producto): string {
    const cat = producto.categoria;
    if (!cat) return '—';
    if (cat.padreId && cat.padre) return `${cat.padre.nombre} · ${cat.nombre}`;
    if (cat.padreId) return cat.nombre;
    return cat.nombre
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

  //Formulario
  abrirCrear(): void  { 
    this.productoEditar = null; 
    this.modalAbierto = true; 
  }

  abrirEditar(p: Producto): void { 
    this.productoEditar = p; 
    this.modalAbierto = true; 
  }

  cerrarModal(): void { 
    this.modalAbierto = false; 
  }

  //Confirmar Eliminación
  confirmarEliminar(id: string): void {
    this.productoEliminarId = id;
    this.modalEliminacionAbierto = true;
  }

  cancelarEliminar(): void {
    this.productoEliminarId = null;
    this.modalEliminacionAbierto = false;
  }

  eliminar(): void {
    if (this.productoEliminarId) {
      this.productos = this.productos.filter(p => p._id !== this.productoEliminarId);
    }
    this.cancelarEliminar();
  }
}