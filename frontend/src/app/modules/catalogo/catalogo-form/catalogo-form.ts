import { Component, EventEmitter, Input, isDevMode, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Modal } from '../../../shared/components';
import { Producto, Categoria } from '../../../models';
import { CATEGORIAS_PRINCIPALES, SUBCATEGORIAS_PASTELES } from '../../../shared/data/mock.data';

@Component({
  selector: 'app-catalogo-form',
  standalone: true,
  imports: [CommonModule, FormsModule, Modal],
  templateUrl: './catalogo-form.html',
  styleUrl: './catalogo-form.css'
})

export class CatalogoForm implements OnChanges {
  @Input()  abierto  = false;
  @Input()  producto: Producto | null = null;
  @Output() cerrar   = new EventEmitter<void>();

  categoriasPrincipales: Categoria[] = CATEGORIAS_PRINCIPALES;
  subcategoriasPasteles: Categoria[] = SUBCATEGORIAS_PASTELES;

  form: {
    nombre:       string;
    precio:       number | null;
    categoriaId:  string;
    descripcion:  string;
    stockMinimo:  number | null;
    stockMaximo:  number | null;
  } = {
    nombre: '', precio: null, categoriaId: '', descripcion: '',
    stockMinimo: null, stockMaximo: null
  };


  get titulo(): string { return this.producto ? 'Editar producto' : 'Crear nuevo producto'; }
  get esEdicion(): boolean { return !!this.producto; }

  get mostrarSubcategorias(): boolean {
    return this.form.categoriaId === 'c1' ||
      this.subcategoriasPasteles.some(s => s._id === this.form.categoriaId);
  }

  ngOnChanges(): void {
    if (this.producto) {
      this.form = {
        nombre:      this.producto.nombre,
        precio:      this.producto.precio,
        categoriaId: this.producto.categoriaId,
        descripcion: this.producto.descripcion ?? '',
        stockMinimo: null,
        stockMaximo: null,
      };
    } else {
      this.form = { 
        nombre: '', 
        precio: null, 
        categoriaId: '', 
        descripcion: '',
        stockMinimo: null,
        stockMaximo: null,
      };
    }
  }

  seleccionarCategoriaPrincipal(id: string): void{
    this.form.categoriaId = id;
  }

  guardar(): void {
    //Aquí irá la llamada al servicio 
    this.cerrar.emit();
  }
}