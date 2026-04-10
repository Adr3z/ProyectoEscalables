import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
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
  @Output() cerrar  = new EventEmitter<void>();
  @Output() guardar = new EventEmitter<EntradaStockForm>();

  form: EntradaStockForm = {
    productoId: '',
    cantidad: 0,
    notas: ''
  };

  ngOnChanges(): void {
    if (!this.abierto) {
      this.form = {
        productoId: '',
        cantidad: 0,
        notas: ''
      };
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

  guardarModal(): void {
    if (!this.form.productoId || !(this.form.cantidad > 0)) {
      this.cerrar.emit();
      return;
    }

    this.guardar.emit({
      productoId: this.form.productoId,
      cantidad: this.form.cantidad,
      notas: this.form.notas,
    });
    this.cerrar.emit();
  }
}