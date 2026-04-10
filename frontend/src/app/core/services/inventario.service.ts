import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../env';
import { EntradaStockForm, Inventario } from '../../models';

@Injectable({ providedIn: 'root' })
export class InventarioService {
    private http = inject(HttpClient);
    private readonly API = `${environment.apiUrl}/inventario`;

    //Consulta de inventario
    getInventario() {
        return this.http.get<Inventario[]>(this.API);
    }

    getInventarioById(id: string) {
        return this.http.get<Inventario>(`${this.API}/${id}`);
    }

    //Registrar entrada de producto
    registrarEntrada(data: EntradaStockForm) {
        return this.http.post(this.API + '/entrada', data);
    }

    //Actualizar límites del inventario
    updateInventario(id: string, data: { stockMinimo: number; stockMaximo: number }) {
        return this.http.put<Inventario>(`${this.API}/${id}`, data);
    }
}
