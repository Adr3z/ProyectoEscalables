import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Rol } from '../../../models';
import { Router } from '@angular/router';
import { Modal } from "../modal/modal";
import { AuthService, User } from '../../../core/services/auth.service';

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

export class Sidebar implements OnInit {

  usuario: User | null = null;
  modalCerrarSesionAbierto = false;
  sidebarAbierto: boolean = false;

  navItems: NavItem[] = [
    { label: 'Catálogo',   ruta: '/admin/catalogo',   icono: 'catalogo',   roles: ['Administrador'] },
    { label: 'Inventario',   ruta: '/admin/inventario',  icono: 'inventario',  roles: ['Administrador', 'Empleado'] },
    { label: 'Movimientos',  ruta: '/admin/movimientos', icono: 'movimientos', roles: ['Administrador'] },
    { label: 'POS',        ruta: '/admin/pos',        icono: 'pos',        roles: ['Administrador', 'Empleado'] },
    { label: 'Usuarios',   ruta: '/admin/usuarios',   icono: 'usuarios',   roles: ['Administrador'] },
  ];

  get itemsVisibles(): NavItem[] {
    if (!this.usuario) return [];
    return this.navItems.filter(item => item.roles.includes(this.usuario!.rol as Rol));
  }

  get iniciales(): string {
    if (!this.usuario) return 'U';
    return this.usuario.nombre.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  }

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.usuario = this.authService.getUser();
  }

  confirmarCerrarSesion(): void {
    this.modalCerrarSesionAbierto = false;
    this.authService.logout();
    this.router.navigate(['/']);
  }

  toggleSidebar() {
    this.sidebarAbierto = !this.sidebarAbierto;
  }
}