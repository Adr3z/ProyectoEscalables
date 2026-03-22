import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  ruta:  string;
  icono: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})

export class Sidebar {

  navItems: NavItem[] = [
    { label: 'Dashboard',  ruta: '/admin/dashboard',  icono: 'dashboard' },
    { label: 'Catálogo',   ruta: '/admin/catalogo',   icono: 'catalogo'  },
    { label: 'Inventario', ruta: '/admin/inventario', icono: 'inventario'},
    { label: 'POS',        ruta: '/admin/pos',        icono: 'pos'       },
    { label: 'Usuarios',   ruta: '/admin/usuarios',   icono: 'usuarios'  },
  ];
}