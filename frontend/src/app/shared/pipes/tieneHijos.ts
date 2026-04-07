// tiene-hijos.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { Categoria } from '../../models';

@Pipe({ name: 'tieneHijos', standalone: true })
export class TieneHijosPipe implements PipeTransform {
    transform(subcategorias: Categoria[], padreId: string): boolean {
        return subcategorias.some(s => s.padreId === padreId);
    }
}