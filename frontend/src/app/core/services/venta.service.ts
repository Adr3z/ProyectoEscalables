import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../env';
import { Venta, VentaForm } from '../../models';

type VentaRequest = VentaForm & { usuarioId: string };

@Injectable({ providedIn: 'root' })
export class VentaService {
    private http = inject(HttpClient);
    private readonly API = `${environment.apiUrl}/ventas`;

    getVentas() {
        return this.http.get<Venta[]>(this.API);
    }

    getVentaById(id: string) {
        return this.http.get<Venta>(`${this.API}/${id}`);
    }

    registrarVenta(form: VentaRequest) {
        return this.http.post<Venta>(this.API, form);
    }
}
