import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Modal } from '../../../shared/components';
import { Producto } from '../../../models';
import { PRODUCTOS_MOCK } from '../../../shared/data/mock.data';

@Component({
  selector: 'app-entrada-form',
  standalone: true,
  imports: [CommonModule, FormsModule, Modal],
  templateUrl: './entrada-form.html',
  styleUrl: './entrada-form.css'
})

export class EntradaForm implements OnChanges {
  @Input()  abierto = false;
  @Output() cerrar  = new EventEmitter<void>();

  productos: Producto[] = PRODUCTOS_MOCK;

  form: { productoId: string; cantidad: number | null; notas: string } = {
    productoId: '',
    cantidad:   null,
    notas:      ''
  };

  ngOnChanges(): void {
    if (!this.abierto) {
      this.form = { productoId: '', cantidad: null, notas: '' };
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

  guardar(): void {
    // Aquí irá la llamada al servicio
    this.cerrar.emit();
  }
}