import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstadoStock } from '../../../models';

@Component({
  selector: 'app-badge-stock',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './badge-stock.html',
  styleUrl: './badge-stock.css'
})

export class BadgeStock {
  @Input() estado!: EstadoStock;

  get clases(): string {
    const mapa: Record<EstadoStock, string> = {
      SUFICIENTE: 'bg-green-100 text-green-700',
      BAJO:       'bg-orange-100 text-orange-700',
      CRITICO:    'bg-red-100 text-red-700',
      AGOTADO:    'bg-gray-100 text-gray-500',
    };
    return mapa[this.estado] ?? '';
  }

  get etiqueta(): string {
    const mapa: Record<EstadoStock, string> = {
      SUFICIENTE: 'Suficiente',
      BAJO:       'Bajo',
      CRITICO:    'Crítico',
      AGOTADO:    'Agotado',
    };
    return mapa[this.estado] ?? '';
  }
}