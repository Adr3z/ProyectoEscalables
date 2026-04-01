import { Producto } from './producto.model';

export interface Inventario {
    _id: string;
    productoId: string;
    producto?: Producto;
    stockMinimo: number;
    stockMaximo: number;
    fechaActualizacion: Date;
}

export interface EntradaStockForm {
    productoId: string;
    cantidad: number;
    notas?: string;
}