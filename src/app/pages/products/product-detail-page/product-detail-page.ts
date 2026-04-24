import { Component, DestroyRef, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIcon } from '@angular/material/icon';

import { AuthService } from '../../../services/auth-service';
import { ProductService } from '../../../services/product-service';
import { Product } from '../../../models/products';
import { Rating } from '../../../utils/rating.util';
import { TimeAgoPipe } from '../../../pipes/time-ago-pipe';
import { Loader } from '../../../components/loader/loader';
import { Error } from '../../../components/error/error';
import { CartService } from '../../../services/cart-service';
import { WishlistService } from '../../../services/wishlist-service';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [CommonModule, TimeAgoPipe, Loader, Error, MatIcon],
  templateUrl: './product-detail-page.html',
  styleUrl: './product-detail-page.css',
})
export class ProductDetailPage {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);

  private destroyRef = inject(DestroyRef);

  private snackBar = inject(MatSnackBar);

  @Input() showWishlistIcon: boolean = true;

  product: Product | null = null;
  isLoading = true;
  errorMsg = false;
  stars: string[] = [];
  showAllReviews = false;
  isPopupOpen = false;

  ngOnInit(): void {
    const productSub = this.route.paramMap.subscribe((params) => {
      const productId = Number(params.get('id'));

      this.isLoading = true;
      this.errorMsg = false;
      this.product = null;
      this.productService.getProductById(productId).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.product = res;
          console.log(res);
          this.stars = Rating.getStars(this.product.rating);
        },
        error: (err) => {
          this.errorMsg = true;
          this.isLoading = false;
          console.error(err);
        },
      });
    });

    this.destroyRef.onDestroy(() => {
      productSub.unsubscribe();
    });
  }

  addToCart(product: Product) {
    const isLoggedIn = this.authService.isLoggedIn();

    if (!isLoggedIn) {
      this.snackBar.open('Please login to add cart', 'Close', {
        duration: 3000,
      });

      this.router.navigate(['/login']);
      return;
    }

    this.cartService.addToCart(product);

    this.snackBar.open('Added to cart', 'Close', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['snackbar-success'],
    });

    this.router.navigate(['/cart']);
  }

  isWishlisted(productId: number): boolean {
    return this.authService.isLoggedIn() && this.wishlistService.isInWishlist(productId);
  }

  addToWishlist(product: any) {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.wishlistService.isInWishlist(product.id)) {
      this.wishlistService.removeFromWishlist(product.id);
    } else {
      this.wishlistService.addToWishlist(product);
    }
  }

  buyNow(product: any) {
    const item = { ...product, quantity: 1 };
    localStorage.setItem('buyNowItem', JSON.stringify(item));
    this.router.navigate(['/cart/checkout']);
  }

  toggleReviews(): void {
    this.showAllReviews = !this.showAllReviews;
  }

  displayedReviews() {
    if (!this.product || !this.product.reviews) return [];
    return this.showAllReviews ? this.product.reviews : [this.product.reviews[0]];
  }

  openReviewsPopup(): void {
    this.isPopupOpen = true;
  }

  closeReviewsPopup(): void {
    this.isPopupOpen = false;
  }
}
