import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { CartService } from '../../services/cart-service';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.css',
})
export class CartPage {
  private router = inject(Router);
  private cartService = inject(CartService);

  cart = this.cartService.cart;
  total = this.cartService.totalPrice;

  remove(id: number) {
    this.cartService.removeItem(id);
  }

  changeQty(id: number, event: Event) {
    const value = +(event.target as HTMLSelectElement).value;
    this.cartService.updateQuantity(id, value);
  }

  getCheckout() {
    if (this.cart().length === 0) {
      return;
    }

    this.router.navigate(['/cart/checkout']);
  }
}
