import { Component, inject, Injector } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-nav',
  imports: [CommonModule, RouterModule, MatButtonModule],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav {
  isAuthenticated: boolean = false;
  currentUsername: string | null = null;
  private authService!: AuthService;

  constructor(private injector: Injector) { }

  ngOnInit(): void {
    this.authService = this.injector.get(AuthService);

    this.authService.currentUser.subscribe(username => {
      this.currentUsername = username;
      this.isAuthenticated = this.authService.isAuthenticated();
      console.log('CurrentUser updated:', username);
    });
  }

  logout(): void {
    this.authService.logout();
    this.isAuthenticated = false;
    this.currentUsername = null;
  }
}
