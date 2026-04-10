import { Categoria } from './categoria.model';

export type EstadoStock = 'SUFICIENTE' | 'BAJO' | 'CRITICO' | 'AGOTADO';

export interface Producto {
  _id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  categoriaId: {
    _id: string;
    nombre: string;
  };
  stockActual: number;
}

export interface ProductoForm {
  nombre: string;
  descripcion?: string;
  precio: number;
  categoriaId: string;
}