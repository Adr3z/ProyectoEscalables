import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Modal } from '../../../shared/components';
import { Producto } from '../../../models';
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

  readonly categoriasPrincipales = CATEGORIAS_PRINCIPALES;
  readonly subcategoriasPasteles = SUBCATEGORIAS_PASTELES;

  form = { nombre: '', precio: 0, categoriaId: '', descripcion: '' };
  padreSeleccionadoId = '';

  get titulo(): string { return this.producto ? 'Editar producto' : 'Crear nuevo producto'; }
  get esEdicion(): boolean { return !!this.producto; }
  get mostrarSubcategorias(): boolean { return this.padreSeleccionadoId === 'c1'; }

  ngOnChanges(): void {
    if (this.producto) {
      const esSub = this.subcategoriasPasteles.some(s => s._id === this.producto!.categoriaId);
      this.padreSeleccionadoId = esSub ? 'c1' : this.producto.categoriaId;
      this.form = {
        nombre:      this.producto.nombre,
        precio:      this.producto.precio,
        categoriaId: this.producto.categoriaId,
        descripcion: this.producto.descripcion ?? ''
      };
    } else {
      this.padreSeleccionadoId = '';
      this.form = { nombre: '', precio: 0, categoriaId: '', descripcion: '' };
    }
  }

  onPadreChange(): void {
    //Si cambia a algo que no es Pasteles, asignar directo
    if (this.padreSeleccionadoId !== 'c1') {
      this.form.categoriaId = this.padreSeleccionadoId;
    } else {
      this.form.categoriaId = '';
    }
  }

  guardar(): void {
    //Aquí irá la llamada al servicio 
    this.cerrar.emit();
  }
}