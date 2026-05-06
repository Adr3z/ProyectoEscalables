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

    // Rutas admin (protegidas)
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

        {
            path: 'inventario',
            loadComponent: () =>
            import('./modules/inventario/inventario-lista/inventario-lista')
                .then(m => m.InventarioLista)
        },

        {
            path: 'movimientos',
            loadComponent: () =>
            import('./modules/inventario/movimientos-lista/movimientos-lista')
                .then(m => m.MovimientosLista)
        },

        {
            path: 'pos',
            loadComponent: () =>
            import('./modules/pos/pos-panel/pos-panel')
                .then(m => m.PosPanel)
        },

        {
            path: 'usuarios',
            loadComponent: () =>
            import('./modules/usuarios/usuarios-lista/usuarios-lista')
                .then(m => m.UsuariosLista)
        },

        {
            path: '',
            redirectTo: 'catalogo',
            pathMatch: 'full'
        },
        ],
    },
    // Login (sin layout)
    {
        path: 'login',
        loadComponent: () =>
        import('./modules/auth/login/login')
            .then(m => m.Login)
    },

    {
        path: 'change-password',
        loadComponent: () =>
        import('./modules/auth/change-password/change-password')
            .then(m => m.ChangePasswordComponent)
    },
    // Fallback
    {
        path: '**',
        redirectTo: ''
    }
];
