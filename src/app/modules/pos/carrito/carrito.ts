import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemCarrito } from '../../../models';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css'
})

export class Carrito {
  @Input()  items: ItemCarrito[] = [];
  @Output() incrementar = new EventEmitter<string>();
  @Output() decrementar = new EventEmitter<string>();
  @Output() eliminar    = new EventEmitter<string>();
  @Output() confirmar   = new EventEmitter<void>();
  @Output() cancelar    = new EventEmitter<void>();

  readonly IMPUESTO = 0.10;

  get subtotal(): number {
    return this.items.reduce((acc, i) => acc + i.producto.precio * i.cantidad, 0);
  }

  get impuesto(): number {
    return this.subtotal * this.IMPUESTO;
  }

  get total(): number {
    return this.subtotal + this.impuesto;
  }
}