import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Rol } from '../../../models';

interface NavItem {
  label: string;
  ruta:  string;
  icono: string;
  roles: Rol[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})

export class Sidebar {

  rolActual: Rol = 'Administrador';

  navItems: NavItem[] = [
    { label: 'Catálogo',   ruta: '/admin/catalogo',   icono: 'catalogo',   roles: ['Administrador'] },
    { label: 'Inventario', ruta: '/admin/inventario', icono: 'inventario', roles: ['Administrador', 'Empleado'] },
    { label: 'POS',        ruta: '/admin/pos',        icono: 'pos',        roles: ['Administrador', 'Empleado'] },
    { label: 'Usuarios',   ruta: '/admin/usuarios',   icono: 'usuarios',   roles: ['Administrador'] },
  ];

  get itemsVisibles(): NavItem[] {
    return this.navItems.filter(item => item.roles.includes(this.rolActual));
  }

  //Mock para alternar rol en desarrollo
  toggleRol(): void {
    this.rolActual = this.rolActual === 'Administrador' ? 'Empleado' : 'Administrador';
  }
}