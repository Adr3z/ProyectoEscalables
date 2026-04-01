import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '../../../models';

@Component({
  selector: 'app-card-pos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-pos.html',
  styleUrl: './card-pos.css'
})
export class CardPos {
  @Input() producto!: Producto;
  @Input() cantidadEnCarrito = 0;
  @Output() agregar = new EventEmitter<Producto>();
}