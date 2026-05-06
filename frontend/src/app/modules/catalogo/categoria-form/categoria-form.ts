import { Component, EventEmitter, Input, OnChanges, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Modal } from '../../../shared/components';
import { Categoria, CategoriaForm as CategoriaFormModel } from '../../../models';
import { CategoriaService } from '../../../core/services';

@Component({
  selector: 'app-categoria-form',
  standalone: true,
  imports: [CommonModule, FormsModule, Modal],
  templateUrl: './categoria-form.html',
  styleUrl: './categoria-form.css'
})
export class CategoriaForm implements OnChanges {

  @Input()  abierto:   boolean         = false;
  @Input()  categoria: Categoria | null = null;
  @Output() cerrar     = new EventEmitter<void>();
  @Output() guardado   = new EventEmitter<void>(); // avisa al padre para recargar

  // ── Estado ────────────────────────────────────────────────────────────────
  guardando = signal(false);
  error     = signal<string | null>(null);

  // ── Categorías principales para el select de "padre" ─────────────────────
  categoriasPrincipales = signal<Categoria[]>([]);

  // ── Formulario ────────────────────────────────────────────────────────────
  form: CategoriaFormModel = { nombre: '', descripcion: '', padreId: '' };

  get formularioValido(): boolean {
    return !!this.form.nombre.trim();
  }

  get titulo(): string     { return this.categoria ? 'Editar categoría' : 'Nueva categoría'; }
  get esEdicion(): boolean { return !!this.categoria; }

  constructor(private categoriaService: CategoriaService) {}

  ngOnChanges(): void {
    this.error.set(null);

    // Carga solo las principales para el select de padre
    if (this.abierto) {
      this.categoriaService.getCategorias().subscribe({
        next: (cats) => this.categoriasPrincipales.set(cats.filter(c => !c.padreId)),
      });
    }

    if (this.categoria) {
      this.form = {
        nombre:      this.categoria.nombre,
        descripcion: this.categoria.descripcion ?? '',
        padreId:     this.categoria.padreId ?? '',
      };
    } else {
      this.form = { nombre: '', descripcion: '', padreId: '' };
    }
  }

  guardar(): void {
    if (!this.form.nombre.trim()) {
      this.error.set('El nombre de la categoría es obligatorio.');
      return;
    }

    this.guardando.set(true);
    this.error.set(null);

    const padreId = this.form.padreId?.trim();
    const payload: CategoriaFormModel = {
      nombre: this.form.nombre.trim(),
      ...(this.form.descripcion?.trim() ? { descripcion: this.form.descripcion.trim() } : {}),
      ...(padreId ? { padreId } : {}),
    };

    const peticion = this.esEdicion
      ? this.categoriaService.updateCategoria(this.categoria!._id, payload)
      : this.categoriaService.createCategoria(payload);

    peticion.subscribe({
      next: () => {
        this.guardando.set(false);
        this.guardado.emit();
        this.cerrar.emit();
      },
      error: () => {
        this.guardando.set(false);
        this.error.set('No se pudo guardar la categoría. Intenta de nuevo.');
      },
    });
  }
}