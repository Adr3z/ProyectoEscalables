import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paginacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paginacion.html',
  styleUrl: './paginacion.css'
})

export class Paginacion implements OnChanges {
  @Input()  total        = 0;
  @Input()  porPagina    = 10;
  @Input()  paginaActual = 1;
  @Output() paginaCambia = new EventEmitter<number>();

  paginas: number[] = [];
  totalPaginas      = 0;

  ngOnChanges(): void {
    this.totalPaginas = Math.ceil(this.total / this.porPagina);
    this.paginas      = Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  ir(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.paginaCambia.emit(pagina);
  }

  get inicio(): number { return (this.paginaActual - 1) * this.porPagina + 1; }
  get fin(): number    { return Math.min(this.paginaActual * this.porPagina, this.total); }
}