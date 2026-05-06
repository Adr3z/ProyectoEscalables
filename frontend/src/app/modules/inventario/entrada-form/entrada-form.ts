import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Modal } from '../../../shared/components';
import { EntradaStockForm, Producto } from '../../../models';

@Component({
  selector: 'app-entrada-form',
  standalone: true,
  imports: [CommonModule, FormsModule, Modal],
  templateUrl: './entrada-form.html',
  styleUrl: './entrada-form.css'
})

export class EntradaForm implements OnChanges {
  @Input()  abierto = false;
  @Input()  productos: Producto[] = [];
  @Input()  mensajeError: string | null = null;
  @Output() cerrar  = new EventEmitter<void>();
  @Output() guardar = new EventEmitter<EntradaStockForm>();

  form: EntradaStockForm = {
    productoId: '',
    cantidad: 0,
    notas: ''
  };

  errorMessage: string | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['abierto'] && !changes['abierto'].currentValue) {
      this.form = {
        productoId: '',
        cantidad: 0,
        notas: ''
      };
      this.errorMessage = null;
    }

    if (changes['mensajeError'] && this.mensajeError) {
      this.errorMessage = this.mensajeError;
    }
  }

  incrementar(): void {
    this.form.cantidad = (this.form.cantidad ?? 0) + 1;
  }

  decrementar(): void {
    if ((this.form.cantidad ?? 0) > 0) {
      this.form.cantidad = (this.form.cantidad ?? 0) - 1;
    }
  }

  get formularioValido(): boolean {
    return !!(
      this.form.productoId &&
      this.form.cantidad > 0
    );
  }

  guardarModal(): void {
    if (!this.form.productoId || !(this.form.cantidad > 0)) {
      this.errorMessage = 'Debes seleccionar un producto y una cantidad válida antes de guardar.';
      return;
    }

    this.errorMessage = null;
    this.guardar.emit({
      productoId: this.form.productoId,
      cantidad: this.form.cantidad,
      notas: this.form.notas,
    });
  }
}