import { Component, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth-service';
import { ProductService } from '../../../services/product-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Product } from '../../../models/products';
import { Rating } from '../../../utils/rating.util';
import { CommonModule } from '@angular/common';
import { TimeAgoPipe } from '../../../pipes/time-ago-pipe';
import { Loader } from '../../../components/loader/loader';
import { Error } from '../../../components/error/error';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [CommonModule, TimeAgoPipe, Loader, Error],
  templateUrl: './product-detail-page.html',
  styleUrl: './product-detail-page.css',
})
export class ProductDetailPage {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private productService = inject(ProductService);
  // Automatic cleanup
  private destroyRef = inject(DestroyRef);

  private snackBar = inject(MatSnackBar);

  // Component State
  product: Product | null = null;
  isLoading = true;
  errorMsg = false;
  stars: string[] = [];
  showAllReviews = false;
  isPopupOpen = false;

  // ProductService to Fatch eatch Products
  ngOnInit(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));

    const productSub = this.productService.getProductById(productId).subscribe({
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

    // Automatically Component Destroyed
    this.destroyRef.onDestroy(() => {
      productSub.unsubscribe();
    });
  }

  addCart(product: any) {
    const isLoggedIn = this.authService.isLoggedIn();

    // ❌ NOT LOGGED IN
    if (!isLoggedIn) {
      this.snackBar.open('Please login to add cart', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['snackbar-error'],
      });

      this.router.navigate(['/login']);
      return;
    }

    this.productService.addToCart(product);

    this.snackBar.open('Added to cart', 'Close', {
      duration: 2000,
    });

    // OPTIONAL: redirect to cart (ONLY if you want)
    this.router.navigate(['/cart']);
  }

  // addCart(product: any) {
  //   const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  //   if (!isLoggedIn) {
  //     this.snackBar.open('Please login to add cart', 'Close', {
  //       duration: 3000,
  //       horizontalPosition: 'center',
  //       verticalPosition: 'top',
  //       panelClass: ['snackbar-error'],
  //     });
  //     this.router.navigate(['/login']);
  //     return;
  //   }

  //   this.productService.addToCart(product);
  // }

  // Review
  toggleReviews(): void {
    this.showAllReviews = !this.showAllReviews;
  }

  displayedReviews() {
    if (!this.product || !this.product.reviews) return [];
    return this.showAllReviews ? this.product.reviews : [this.product.reviews[0]];
  }

  // Popup Model view open & close
  openReviewsPopup(): void {
    this.isPopupOpen = true;
  }

  closeReviewsPopup(): void {
    this.isPopupOpen = false;
  }
}
