import { Component, inject } from '@angular/core';
import { WishlistService } from '../../services/wishlist-service';
import { CartService } from '../../services/cart-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Rating } from '../../utils/rating.util';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wishlist-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wishlist-page.html',
  styleUrl: './wishlist-page.css',
})
export class WishlistPage {
  public wishlistService = inject(WishlistService);
  private cartService = inject(CartService);

  private snackBar = inject(MatSnackBar);

  getRating() {
    return Rating;
  }

  addToCart(product: any) {
    this.cartService.addToCart(product);
    this.wishlistService.removeFromWishlist(product.id);
    this.snackBar.open('Moved to cart', 'Close', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['snackbar-success'],
    });
  }
}
