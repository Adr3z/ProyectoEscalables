import { Producto } from './producto.model';

export type TipoMovimiento = 'ENTRADA' | 'SALIDA';

export type MovimientoProducto = {
    _id: string;
    nombre: string;
    categoriaId?: { nombre: string };
};

export interface Movimiento {
    _id: string;
    tipo: TipoMovimiento;
    productoId: string | MovimientoProducto;
    producto?: Producto | MovimientoProducto;
    nombreProducto?: string; // Campo adicional para mostrar el nombre directamente
    cantidad: number;
    fecha: Date;
    usuarioId?: string;
    notas?: string;
}