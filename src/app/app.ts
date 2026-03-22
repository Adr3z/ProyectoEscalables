import { Component, signal } from '@angular/core';
import { RouterOutlet, ɵEmptyOutletComponent } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ɵEmptyOutletComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ProyectoEscalables');
}
