import { Component, OnDestroy } from '@angular/core';
import { Router, NavigationStart} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs';
import { BusquedaService } from '../../../core/services/busqueda.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})

export class Navbar implements OnDestroy {
  usuarioNombre = 'Ana Baker';
  usuarioRol    = 'Gerente';
  termino       = '';

  private sub: Subscription;
  
  constructor(
    private busquedaService: BusquedaService,
    private router: Router
  ) {
    // Limpia la búsqueda al cambiar de ruta
    this.sub = this.router.events.pipe(
      filter(e => e instanceof NavigationStart)
    ).subscribe(() => {
      this.termino = '';
      this.busquedaService.limpiar();
    });
  }

  onBusqueda(event: Event): void {
    this.termino = (event.target as HTMLInputElement).value;
    this.busquedaService.setTermino(this.termino);
  }

  limpiar(): void {
    this.termino = '';
    this.busquedaService.limpiar();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}