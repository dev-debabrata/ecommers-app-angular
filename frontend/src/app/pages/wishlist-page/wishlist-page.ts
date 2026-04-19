import { Component, inject } from '@angular/core';
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
  public wishlistService = inject(WishlistService);
  private router = inject(Router);
  private cartService = inject(CartService);

  private snackBar = inject(MatSnackBar);

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

  viewDetails(id: number) {
    this.router.navigate(['/products', id]);
  }
}
