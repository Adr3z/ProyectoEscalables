import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../env";
import { Producto, ProductoForm } from "../../models";

@Injectable({ providedIn: 'root' })
export class ProductoService {
    private http = inject(HttpClient);
    private readonly API = `${environment.apiUrl}/productos`;

    //Consulta de productos
    getProductos() {
        return this.http.get<Producto[]>(this.API);
    }

    getProductoById(id:string) {
        return this.http.get<Producto>(`${this.API}/${id}`);
    }

    getProductosPublicos() {
        return this.http.get<Producto[]>(`${this.API}/publicos`);
    }

    //Crear producto
    createProducto(form: ProductoForm) {
        return this.http.post<Producto>(this.API, form);
    }

    //Editar producto
    updateProducto(id: string, form: ProductoForm) {
        return this.http.put<Producto>(`${this.API}/${id}`, form);
    }

    //Eliminar producto
    deleteProducto(id: string) {
        return this.http.delete<void>(`${this.API}/${id}`);
    }
}