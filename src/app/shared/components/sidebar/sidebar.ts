import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Rol } from '../../../models';
import { Router } from '@angular/router';
import { Modal } from "../modal/modal";

interface NavItem {
  label: string;
  ruta:  string;
  icono: string;
  roles: Rol[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, Modal],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})

export class Sidebar {

  rolActual: Rol = 'Administrador';
  modalCerrarSesionAbierto = false;
  sidebarAbierto: boolean = false

  navItems: NavItem[] = [
    { label: 'Catálogo',   ruta: '/admin/catalogo',   icono: 'catalogo',   roles: ['Administrador'] },
    { label: 'Inventario',   ruta: '/admin/inventario',  icono: 'inventario',  roles: ['Administrador', 'Empleado'] },
    { label: 'Movimientos',  ruta: '/admin/movimientos', icono: 'movimientos', roles: ['Administrador'] },
    { label: 'POS',        ruta: '/admin/pos',        icono: 'pos',        roles: ['Administrador', 'Empleado'] },
    { label: 'Usuarios',   ruta: '/admin/usuarios',   icono: 'usuarios',   roles: ['Administrador'] },
  ];

  get itemsVisibles(): NavItem[] {
    return this.navItems.filter(item => item.roles.includes(this.rolActual));
  }

  constructor(private router: Router) {}

  //Mock para alternar rol en desarrollo
  toggleRol(): void {
    this.rolActual = this.rolActual === 'Administrador' ? 'Empleado' : 'Administrador';
  }

  confirmarCerrarSesion(): void {
    this.modalCerrarSesionAbierto = false;
    this.router.navigate(['/']);
  }

  toggleSidebar() {
    this.sidebarAbierto = !this.sidebarAbierto;
  }
}