import { Component, computed, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { WishlistService } from '../../services/wishlist-service';
import { CartService } from '../../services/cart-service';
import { Rating } from '../../utils/rating.util';
import { Product } from '../../models/products';
import { SnackbarService } from '../../services/snackbar-service';
import { ProductService } from '../../services/product-service';

@Component({
  selector: 'app-wishlist-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wishlist-page.html',
  styleUrl: './wishlist-page.css',
})
export class WishlistPage implements OnInit {
  private router = inject(Router);
  private cartService = inject(CartService);
  private productService = inject(ProductService);
  private wishlistService = inject(WishlistService);
  private snackBar = inject(SnackbarService);
  private destroyRef = inject(DestroyRef);

  wishlistItems = this.wishlistService.getWishlistSignal;
  wishlistCount = computed(() => this.wishlistItems().length);

  ngOnInit() {
    const wishlistSub = this.wishlistService.getWishlist().subscribe({
      next: (items) => {
        console.log('Wishlist loaded:', items);
      },
      error: (err) => {
        console.error('Wishlist load error:', err);
        this.snackBar.error('Failed to load wishlist');
      },
    });

    this.destroyRef.onDestroy(() => {
      wishlistSub.unsubscribe();
    });
  }

  getRating() {
    return Rating;
  }

  getDiscountPrice(item: Product): number {
    return this.productService.getDiscountPrice(item);
  }

  addToCart(product: Product, event: Event) {
    event.stopPropagation();

    this.cartService.addToCart(product);
    this.wishlistService.removeFromWishlist(product.id!).subscribe();

    this.snackBar.success('Moved to cart');
  }

  removeFromWishlist(productId: string, event: Event) {
    event.stopPropagation();
    this.wishlistService.removeFromWishlist(productId).subscribe();
    this.snackBar.success('Remove to wishlist');
  }

  viewDetails(id: string) {
    this.router.navigate(['/products', id]);
  }
}

///////////////////////////////////////////////
////////// JSON VERSION //////////////////////

// import { Component, computed, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Router } from '@angular/router';
// import { MatSnackBar } from '@angular/material/snack-bar';

// import { WishlistService } from '../../services/wishlist-service';
// import { CartService } from '../../services/cart-service';
// import { Rating } from '../../utils/rating.util';

// @Component({
//   selector: 'app-wishlist-page',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './wishlist-page.html',
//   styleUrl: './wishlist-page.css',
// })
// export class WishlistPage {
//   private router = inject(Router);
//   private cartService = inject(CartService);
//   private wishlistService = inject(WishlistService);

//   private snackBar = inject(MatSnackBar);

//   wishlistItems = this.wishlistService.getWishlist;
//   wishlistCount = computed(() => this.wishlistItems().length);

//   getRating() {
//     return Rating;
//   }

//   addToCart(product: any, event: Event) {
//     event.stopPropagation();

//     this.cartService.addToCart(product);
//     this.wishlistService.removeFromWishlist(product.id);

//     this.snackBar.open('Moved to cart', 'Close', {
//       duration: 2000,
//       horizontalPosition: 'center',
//       verticalPosition: 'top',
//       panelClass: ['snackbar-success'],
//     });
//   }

//   removeFromWishlist(productId: number, event: Event) {
//     event.stopPropagation();
//     this.wishlistService.removeFromWishlist(productId);
//   }

//   viewDetails(id: number) {
//     this.router.navigate(['/products', id]);
//   }
// }

// // addToCart(product: any) {
// //   this.cartService.addToCart(product);
// //   this.wishlistService.removeFromWishlist(product.id);
// //   this.snackBar.open('Moved to cart', 'Close', {
// //     duration: 2000,
// //     horizontalPosition: 'center',
// //     verticalPosition: 'top',
// //     panelClass: ['snackbar-success'],
// //   });
// // }
