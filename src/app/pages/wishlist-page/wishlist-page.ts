import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { WishlistService } from '../../services/wishlist-service';
import { CartService } from '../../services/cart-service';
import { Rating } from '../../utils/rating.util';

@Component({
  selector: 'app-wishlist-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wishlist-page.html',
  styleUrl: './wishlist-page.css',
})
export class WishlistPage {
  private router = inject(Router);
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);

  private snackBar = inject(MatSnackBar);

  wishlistItems = this.wishlistService.getWishlist;
  wishlistCount = computed(() => this.wishlistItems().length);

  getRating() {
    return Rating;
  }

  addToCart(product: any, event: Event) {
    event.stopPropagation();

    this.cartService.addToCart(product);
    this.wishlistService.removeFromWishlist(product.id);

    this.snackBar.open('Moved to cart', 'Close', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['snackbar-success'],
    });
  }

  removeFromWishlist(productId: number, event: Event) {
    event.stopPropagation();
    this.wishlistService.removeFromWishlist(productId);
  }

  viewDetails(id: number) {
    this.router.navigate(['/products', id]);
  }
}

// addToCart(product: any) {
//   this.cartService.addToCart(product);
//   this.wishlistService.removeFromWishlist(product.id);
//   this.snackBar.open('Moved to cart', 'Close', {
//     duration: 2000,
//     horizontalPosition: 'center',
//     verticalPosition: 'top',
//     panelClass: ['snackbar-success'],
//   });
// }
