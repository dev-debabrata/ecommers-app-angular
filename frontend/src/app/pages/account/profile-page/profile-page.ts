import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { AuthService } from '../../../services/auth-service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css',
})
export class ProfilePage {
  private authService = inject(AuthService);
  private router = inject(Router);

  user = this.authService.getUser();

  orders = JSON.parse(localStorage.getItem('orders') || '[]');

  activeSection = 'orders';

  changeSection(section: string) {
    this.activeSection = section;
  }

  logout() {
    this.authService.removeToken();
    this.router.navigate(['/login']);
  }
}
