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

  activeSection = 'orders';

  changeSection(section: string) {
    this.activeSection = section;
  }

  get orders() {
    const data = localStorage.getItem('orders');

    if (!data) return [];

    try {
      const orders = JSON.parse(data);

      const orderList = Array.isArray(orders) ? orders : [orders];

      return orderList.sort(
        (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    } catch {
      return [];
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  viewProductDetails(productId: number) {
    this.router.navigate(['/products', productId]);
  }
}
