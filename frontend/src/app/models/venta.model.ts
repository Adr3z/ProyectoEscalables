import { Producto } from './producto.model';

export interface DetalleVenta {
    _id?: string;
    ventaId?: string;
    productoId: string;
    producto?: Producto;
    cantidad: number;
    precioUnitario: number;
}

export interface Venta {
    _id: string;
    fecha: Date;
    total: number;
    usuarioId: string;
    detalles: DetalleVenta[];
}

export interface VentaForm {
    detalles: DetalleVentaForm[];
}

export interface DetalleVentaForm {
    productoId: string;
    cantidad: number;
    precioUnitario: number;
}

export interface ItemCarrito {
    producto: Producto;
    cantidad: number;
}

export type EstadoItemVenta = 'ok' | 'bajo-minimo' | 'insuficiente';

export interface ItemValidado {
    item: ItemCarrito;
    estado: EstadoItemVenta;
    stockTrasVenta: number;
    stockMinimo: number;
}
