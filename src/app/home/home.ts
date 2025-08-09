import { Component, Injector, OnInit } from '@angular/core';
import { Register } from '../Auth/register/register';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  isAuthenticated: boolean = false;
  private authService!: AuthService;

  constructor(private injector: Injector) { }

  ngOnInit(): void {
    this.authService = this.injector.get(AuthService);
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout();
    this.isAuthenticated = false;
  }
}
