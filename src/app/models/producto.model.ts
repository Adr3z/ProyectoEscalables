import { Categoria } from './categoria.model';

export type EstadoStock = 'SUFICIENTE' | 'BAJO' | 'CRITICO' | 'AGOTADO';

export interface Producto {
  _id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  categoriaId: string;
  categoria?: Categoria;
  stockActual: number;
}

export interface ProductoForm {
  nombre: string;
  descripcion?: string;
  precio: number;
  categoriaId: string;
}