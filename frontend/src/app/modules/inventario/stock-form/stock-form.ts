import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Modal } from '../../../shared/components';
import { Inventario } from '../../../models';

@Component({
  selector: 'app-stock-form',
  standalone: true,
  imports: [CommonModule, FormsModule, Modal],
  templateUrl: './stock-form.html',
  styleUrl: './stock-form.css'
})

export class StockForm implements OnChanges {
  @Input()  abierto    = false;
  @Input()  inventario: Inventario | null = null;
  @Output() cerrar     = new EventEmitter<void>();
  @Output() guardar    = new EventEmitter<{ stockMinimo: number; stockMaximo: number }>();

  form: { stockMinimo: number | null; stockMaximo: number | null } = {
    stockMinimo: null,
    stockMaximo: null
  };

  get nombreProducto(): string {
    return this.inventario?.producto?.nombre ?? '—';
  }

  ngOnChanges(): void {
    if (this.inventario) {
      this.form = {
        stockMinimo: this.inventario.stockMinimo,
        stockMaximo: this.inventario.stockMaximo
      };
    } else {
      this.form = { stockMinimo: null, stockMaximo: null };
    }
  }

  onGuardar(): void {
    if (this.form.stockMinimo !== null && this.form.stockMaximo !== null) {
      this.guardar.emit({
        stockMinimo: this.form.stockMinimo,
        stockMaximo: this.form.stockMaximo
      });
    }
    this.cerrar.emit();
  }
}