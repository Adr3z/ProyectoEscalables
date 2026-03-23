import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardProducto } from '../../../shared/components';
import { Producto, Categoria } from '../../../models';
import { PRODUCTOS_MOCK, CATEGORIAS_PRINCIPALES, SUBCATEGORIAS_PASTELES } from '../../../shared/data/mock.data';

@Component({
  selector: 'app-catalogo-publico',
  standalone: true,
  imports: [CommonModule, CardProducto],
  templateUrl: './catalogo-publico.html',
  styleUrl: './catalogo-publico.css'
})


export class CatalogoPublico {

  productos: Producto[]              = PRODUCTOS_MOCK;
  categoriasPrincipales: Categoria[] = CATEGORIAS_PRINCIPALES;
  subcategoriasPasteles: Categoria[] = SUBCATEGORIAS_PASTELES;

  categoriaActivaId: string | null = null;
  mostrarSubcategorias = false;

  //busqueda
  termino = '';

  get productosFiltrados(): Producto[] {
    let lista = this.productos;

    if (this.categoriaActivaId === 'c1') {
      lista = lista.filter(p => p.categoria?.padreId === 'c1' || p.categoriaId === 'c1');
    } else if (this.categoriaActivaId) {
      lista = lista.filter(p => p.categoriaId === this.categoriaActivaId);
    }

    if (this.termino.trim()) {
      const q = this.termino.toLowerCase();
      lista = lista.filter(p => p.nombre.toLowerCase().includes(q));
    }

    return lista;
  }

  onBusqueda(event: Event): void {
    this.termino = (event.target as HTMLInputElement).value;
  }

  limpiarBusqueda(): void {
    this.termino = '';
  }

//-----------------------

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
    this.categoriaActivaId    = null;
    this.mostrarSubcategorias = false;
  }

  estaActiva(id: string): boolean {
    return this.categoriaActivaId === id;
  }
}