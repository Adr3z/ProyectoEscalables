import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../env';
import { Movimiento } from '../../models';

@Injectable({ providedIn: 'root' })
export class MovimientoService {
    private http = inject(HttpClient);
    private readonly API = `${environment.apiUrl}/movimientos`;

    getMovimientos() {
        return this.http.get<Movimiento[]>(this.API);
    }

    updateMovimiento(id: string, movimiento: Partial<Movimiento>) {
        return this.http.put<Movimiento>(`${this.API}/${id}`, movimiento);
    }

    deleteMovimiento(id: string) {
        return this.http.delete(`${this.API}/${id}`);
    }
}
