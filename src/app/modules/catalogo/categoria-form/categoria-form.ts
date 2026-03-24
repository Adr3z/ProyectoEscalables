import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Modal } from '../../../shared/components';
import { Categoria } from '../../../models';
import { CATEGORIAS_PRINCIPALES } from '../../../shared/data/mock.data';

@Component({
  selector: 'app-categoria-form',
  standalone: true,
  imports: [CommonModule, FormsModule, Modal],
  templateUrl: './categoria-form.html',
  styleUrl: './categoria-form.css'
})

export class CategoriaForm implements OnChanges {
  @Input()  abierto   = false;
  @Input()  categoria: Categoria | null = null;
  @Output() cerrar    = new EventEmitter<void>();

  categoriasPrincipales: Categoria[] = CATEGORIAS_PRINCIPALES;

  form: { nombre: string; descripcion: string; padreId: string } = {
    nombre: '', descripcion: '', padreId: ''
  };

  get titulo(): string     { return this.categoria ? 'Editar categoría' : 'Nueva categoría'; }
  get esEdicion(): boolean { return !!this.categoria; }

  ngOnChanges(): void {
    if (this.categoria) {
      this.form = {
        nombre:      this.categoria.nombre,
        descripcion: this.categoria.descripcion ?? '',
        padreId:     this.categoria.padreId ?? ''
      };
    } else {
      this.form = { nombre: '', descripcion: '', padreId: '' };
    }
  }

  guardar(): void {
    //Aquí irá la llamada al servicio 
    this.cerrar.emit();
  }
}