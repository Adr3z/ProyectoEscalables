export interface Categoria {
    _id: string;
    nombre: string;
    descripcion?: string;
    padreId?: string;           //si es null es una categoría principal
    padre?: Categoria;
}

export interface CategoriaForm {
    nombre: string;
    descripcion?: string;
    padreId?: string;
}


//Hay 4 categorías principales: Pasteles, Gelatinas, Pays y Galletas
//Pasteles se divide en: 3 leches, Caseros, Chocolate, Chicos e Individuales.