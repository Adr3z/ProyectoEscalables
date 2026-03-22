import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar, Sidebar } from '../../shared/components';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, Navbar, Sidebar],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayout {}