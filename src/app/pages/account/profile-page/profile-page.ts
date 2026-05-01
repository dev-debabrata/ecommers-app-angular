import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { AuthService } from '../../../services/auth-service';
import { OrderService } from '../../../services/order-service';
import { ProfileDetails } from '../profile-details/profile-details';
import { AddressBook } from '../address-book/address-book';
import { OrderHistory } from '../order-history/order-history';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, ProfileDetails, AddressBook, OrderHistory],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css',
})
export class ProfilePage implements OnInit {
  private authService = inject(AuthService);
  private orderService = inject(OrderService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  user: any = null;
  orders: any[] = [];

  activeSection = 'orders';

  ngOnInit() {
    const userSub = this.authService.getFullUser().subscribe({
      next: (user) => {
        this.user = user;

        if (!user?.uid) return;

        const orderSub = this.orderService.getUserOrders(user.uid).subscribe({
          next: (orders) => {
            this.orders = orders.map((o: any) => ({
              ...o,
              date: o.date?.toDate ? o.date.toDate() : o.date,
            }));
          },
          error: (err) => {
            console.error('Orders error:', err);
          },
        });

        this.destroyRef.onDestroy(() => {
          orderSub.unsubscribe();
        });
      },

      error: (err) => {
        console.error('User error:', err);
      },
    });

    this.destroyRef.onDestroy(() => {
      userSub.unsubscribe();
    });
  }

  changeSection(section: string) {
    this.activeSection = section;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
