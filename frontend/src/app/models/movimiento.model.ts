import { Producto } from './producto.model';

export type TipoMovimiento = 'ENTRADA' | 'SALIDA';

export interface Movimiento {
    _id: string;
    tipo: TipoMovimiento;
    productoId: string;
    producto?: Producto;
    cantidad: number;
    fecha: Date;
    usuarioId: string;
}