import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

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
