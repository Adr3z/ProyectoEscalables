import { Routes } from '@angular/router';
import { PublicLayout } from './layouts/public-layout/public-layout';
import { AdminLayout } from './layouts/admin-layout/admin-layout';

export const routes: Routes = [

    //Rutas públicas
    {
        path: '',
        component: PublicLayout,
        children: [
        {
            path: '',
            loadComponent: () =>
            import('./modules/catalogo/catalogo-publico/catalogo-publico')
                .then(m => m.CatalogoPublico)
        }
        ]
    },

    // Rutas admin
    {
        path: 'admin',
        component: AdminLayout,
        children: [
        {
            path: 'catalogo',
            loadComponent: () =>
            import('./modules/catalogo/catalogo-lista/catalogo-lista')
                .then(m => m.CatalogoLista)
        },
        ]
    },
];
