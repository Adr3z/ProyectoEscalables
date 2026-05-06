import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../env';
import { Categoria } from '../../models';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
    private http = inject(HttpClient);
    private readonly API = `${environment.apiUrl}/categorias`;

    //Consulta de categorías
    getCategorias() {
        return this.http.get<Categoria[]>(this.API);
    }

    //Consulta pública de categorías
    getCategoriasPublicas() {
        return this.http.get<Categoria[]>(`${this.API}/publicas`);
    }

    //Crear categoría
    createCategoria(data: Omit<Categoria, '_id'>) {
        return this.http.post<Categoria>(this.API, data);
    }

    //Editar categoría
    updateCategoria(id: string, data: Omit<Categoria, '_id'>) {
        return this.http.put<Categoria>(`${this.API}/${id}`, data);
    }

    //Eliminar categoría
    deleteCategoria(id: string) {
        return this.http.delete<void>(`${this.API}/${id}`);
    }
}