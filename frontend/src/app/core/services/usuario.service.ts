import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../env';
import { Usuario, UsuarioForm } from '../../models';

@Injectable({
    providedIn: 'root'
    })
    export class UsuarioService {
    private apiUrl = `${environment.apiUrl}/usuarios`;

    constructor(private http: HttpClient) {}

    getUsuarios(): Observable<Usuario[]> {
        return this.http.get<Usuario[]>(this.apiUrl);
    }

    getUsuarioById(id: string): Observable<Usuario> {
        return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
    }

    createUsuario(usuario: UsuarioForm): Observable<Usuario> {
        return this.http.post<Usuario>(this.apiUrl, usuario);
    }

    updateUsuario(id: string, usuario: Partial<UsuarioForm>): Observable<Usuario> {
        return this.http.put<Usuario>(`${this.apiUrl}/${id}`, usuario);
    }

    deleteUsuario(id: string): Observable<Usuario> {
        return this.http.delete<Usuario>(`${this.apiUrl}/${id}`);
    }
}