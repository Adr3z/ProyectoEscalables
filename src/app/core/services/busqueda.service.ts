import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class BusquedaService {
    private termino = new BehaviorSubject<string>('');
    termino$ = this.termino.asObservable();

    setTermino(valor: string): void {
        this.termino.next(valor);
    }

    limpiar(): void {
        this.termino.next('');
    } 
}

//BehaviorSubject:
// guarda un valor actual
// emite ese valor a quien se suscriba
// empieza con '' (vacío)

//Este servicio es para poder hacer funcional la barra de busqueda del navbar en todas las vistas