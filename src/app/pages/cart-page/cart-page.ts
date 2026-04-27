import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { CartService } from '../../services/cart-service';
import { CartItem } from '../../models/cart-item';

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

  getDiscountPrice(item: CartItem): number {
    if (!item.discount) return item.price;

    return item.price - (item.price * item.discount) / 100;
  }

  remove(id: string) {
    this.cartService.removeItem(id);
  }

  changeQty(id: string, event: Event) {
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
