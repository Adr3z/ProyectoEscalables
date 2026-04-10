import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Modal } from '../../../shared/components';
import { Producto, Categoria, ProductoForm } from '../../../models';
import { CategoriaService } from '../../../core/services/categoria.service';
import { ProductoService } from '../../../core/services/producto.service';

@Component({
  selector: 'app-catalogo-form',
  standalone: true,
  imports: [CommonModule, FormsModule, Modal],
  templateUrl: './catalogo-form.html',
  styleUrl: './catalogo-form.css'
})

export class CatalogoForm implements OnChanges {
  @Input()  abierto  = false;
  @Input()  producto: Producto | null = null;
  @Output() cerrar   = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<void>();

  categoriasPrincipales: Categoria[] = [];
  subcategorias: Categoria[] = [];

  form: {
    nombre:       string;
    precio:       number | null;
    categoriaId:  string;
    descripcion:  string;
    stockMinimo:  number | null;
    stockMaximo:  number | null;
  } = {
    nombre: '', precio: null, categoriaId: '', descripcion: '',
    stockMinimo: null, stockMaximo: null
  };


  get titulo(): string { return this.producto ? 'Editar producto' : 'Crear nuevo producto'; }
  get esEdicion(): boolean { return !!this.producto; }

  get categoriaPrincipalSeleccionadaId(): string {
    const categoriaPrincipal = this.categoriasPrincipales.find(c => c._id === this.form.categoriaId);
    if (categoriaPrincipal) {
      return categoriaPrincipal._id;
    }

    const subcategoria = this.subcategorias.find(s => s._id === this.form.categoriaId);
    return subcategoria?.padreId ?? '';
  }

  get mostrarSubcategorias(): boolean {
    return !!this.categoriaPrincipalSeleccionadaId
      && this.subcategorias.some(s => s.padreId === this.categoriaPrincipalSeleccionadaId);
  }

  get subcategoriasSeleccionadas(): Categoria[] {
    return this.subcategorias.filter(s => s.padreId === this.categoriaPrincipalSeleccionadaId);
  }

  constructor(
    private categoriaService: CategoriaService,
    private productoService: ProductoService,
  ) {}

  ngOnChanges(): void {
    if (this.abierto) {
      this.loadCategorias();
    }

    if (this.producto) {
      this.form = {
        nombre:      this.producto.nombre,
        precio:      this.producto.precio,
        categoriaId: this.producto.categoriaId._id,
        descripcion: this.producto.descripcion ?? '',
        stockMinimo: null,
        stockMaximo: null,
      };
    } else {
      this.form = {
        nombre: '',
        precio: null,
        categoriaId: '',
        descripcion: '',
        stockMinimo: null,
        stockMaximo: null,
      };
    }
  }

  private loadCategorias(): void {
    this.categoriaService.getCategorias().subscribe({
      next: categorias => {
        this.categoriasPrincipales = categorias.filter(c => !c.padreId);
        this.subcategorias = categorias.filter(c => !!c.padreId);
      },
      error: () => {
        this.categoriasPrincipales = [];
        this.subcategorias = [];
      }
    });
  }

  seleccionarCategoriaPrincipal(id: string): void {
    this.form.categoriaId = id;
  }

  guardar(): void {
    const payload = {
      nombre: this.form.nombre.trim(),
      precio: this.form.precio ?? 0,
      categoriaId: this.form.categoriaId,
      descripcion: this.form.descripcion?.trim() || undefined,
      ...(this.form.stockMinimo != null && { stockMinimo: this.form.stockMinimo }),
      ...(this.form.stockMaximo != null && { stockMaximo: this.form.stockMaximo }),
    } as ProductoForm & { stockMinimo?: number; stockMaximo?: number };

    const request = this.esEdicion
      ? this.productoService.updateProducto(this.producto!._id, payload)
      : this.productoService.createProducto(payload);

    request.subscribe({
      next: () => {
        this.cerrar.emit();
        this.guardado.emit();
      },
      error: () => {
        this.cerrar.emit();
      }
    });
  }
}