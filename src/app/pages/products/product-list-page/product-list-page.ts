import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

import { ProductService } from '../../../services/product-service';
import { Product } from '../../../models/products';
import { Rating } from '../../../utils/rating.util';
import { Error } from '../../../components/error/error';
import { TruncatePipe } from '../../../pipes/truncate-pipe';
import { Loader } from '../../../components/loader/loader';
import { Highlight } from '../../../directives/highlight';
import { WishlistService } from '../../../services/wishlist-service';
import { AuthService } from '../../../services/auth-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoaderService } from '../../../services/loader-service';
import { SnackbarService } from '../../../services/snackbar-service';

@Component({
  selector: 'app-product-list-page',
  standalone: true,
  imports: [CommonModule, FormsModule, TruncatePipe, Highlight, Error, MatIcon],
  templateUrl: './product-list-page.html',
  styleUrl: './product-list-page.css',
})
export class ProductListPage implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private productService = inject(ProductService);
  private wishlistService = inject(WishlistService);
  private destroyRef = inject(DestroyRef);
  private loaderService = inject(LoaderService);
  private snackBar = inject(SnackbarService);

  @Input() showCategories = true;
  @Input() limit: number | null = null;
  @Input() showWishlistIcon = true;

  products: Product[] = [];
  // isLoading = true;
  errorMsg = false;

  searchTerm = '';
  selectedCategory = 'All';
  categories: string[] = [];

  ngOnInit(): void {
    this.loaderService.show();

    const productSub = this.productService.getProducts().subscribe({
      next: (res: Product[]) => {
        const sorted = [...res].sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0));

        // this.isLoading = false;

        let products = sorted;

        if (this.limit) {
          products = products.slice(0, this.limit);
        }

        this.products = products;

        if (this.showCategories) {
          const cats = this.products.map((p) => p.category);
          const uniqueCats = Array.from(new Set(cats));
          this.categories = ['All', ...uniqueCats];
        }
        this.loaderService.hide();
        console.log(res);
      },

      error: () => {
        this.loaderService.hide();
        // this.isLoading = false;
        this.errorMsg = true;
      },
    });

    this.destroyRef.onDestroy(() => {
      productSub.unsubscribe();
    });
  }

  getDiscountPrice(item: Product): number {
    return this.productService.getDiscountPrice(item);
  }

  getFilteredProducts(): Product[] {
    const search = this.searchTerm.toLowerCase();

    return this.products.filter((product) => {
      const matchesSearch = product.title.toLowerCase().includes(search);

      const matchesCategory =
        this.selectedCategory === 'All' || product.category === this.selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }

  isWishlisted(productId: string): boolean {
    return this.authService.isLoggedIn() && this.wishlistService.isInWishlist(productId);
  }

  addToWishlist(product: Product) {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.wishlistService.isInWishlist(product.id!)) {
      this.wishlistService.removeFromWishlist(product.id!);
      this.snackBar.error('Removed from wishlist');
    } else {
      this.wishlistService.addToWishlist(product);
      this.snackBar.success('Added to wishlist');
    }
  }

  viewDetails(id: string) {
    this.router.navigate(['/products', id]);
  }

  getRating() {
    return Rating;
  }
}

// import { Component, DestroyRef, inject, Input } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import { MatIcon } from '@angular/material/icon';

// import { ProductService } from '../../../services/product-service';
// import { Product } from '../../../models/products';
// import { Rating } from '../../../utils/rating.util';
// import { Error } from '../../../components/error/error';
// import { TruncatePipe } from '../../../pipes/truncate-pipe';
// import { Loader } from '../../../components/loader/loader';
// import { Highlight } from '../../../directives/highlight';
// import { WishlistService } from '../../../services/wishlist-service';
// import { AuthService } from '../../../services/auth-service';

// @Component({
//   selector: 'app-product-list-page',
//   standalone: true,
//   imports: [CommonModule, FormsModule, TruncatePipe, Highlight, Loader, Error, MatIcon],
//   templateUrl: './product-list-page.html',
//   styleUrl: './product-list-page.css',
// })
// export class ProductListPage {
//   private authService = inject(AuthService);
//   private router = inject(Router);
//   private productService = inject(ProductService);
//   private wishlistService = inject(WishlistService);

//   private destroyRef = inject(DestroyRef);

//   @Input() showCategories: boolean = true;
//   @Input() limit: number | null = null;
//   @Input() showWishlistIcon: boolean = true;

//   products: Product[] = [];
//   isLoading = true;
//   errorMsg = false;

//   searchTerm = '';
//   selectedCategory = 'All';
//   categories: string[] = [];

//   ngOnInit(): void {
//     const productSub = this.productService.getProducts().subscribe({
//       next: (res: any) => {
//         this.isLoading = false;

//         let products = res.products;

//         if (this.limit) {
//           products = products.slice(0, this.limit);
//         }

//         this.products = products;

//         if (this.showCategories) {
//           const cats = this.products.map((p) => p.category);

//           const uniqueCats = Array.from(new Set(cats));

//           this.categories = ['All', ...uniqueCats];
//         }
//         console.log(res);
//       },

//       error: () => {
//         this.isLoading = false;
//         this.errorMsg = true;
//       },
//     });
//     this.destroyRef.onDestroy(() => {
//       productSub.unsubscribe();
//     });
//   }

//   getFilteredProducts(): Product[] {
//     const search = this.searchTerm.toLowerCase();

//     return this.products.filter((product) => {
//       const matchesSearch = product.title.toLowerCase().includes(search);

//       const matchesCategory =
//         this.selectedCategory === 'All' || product.category === this.selectedCategory;

//       return matchesSearch && matchesCategory;
//     });
//   }

//   isWishlisted(productId: number): boolean {
//     return this.authService.isLoggedIn() && this.wishlistService.isInWishlist(productId);
//   }

//   addToWishlist(product: any) {
//     if (!this.authService.isLoggedIn()) {
//       this.router.navigate(['/login']);
//       return;
//     }

//     if (this.wishlistService.isInWishlist(product.id)) {
//       this.wishlistService.removeFromWishlist(product.id);
//     } else {
//       this.wishlistService.addToWishlist(product);
//     }
//   }

//   viewDetails(id: number) {
//     this.router.navigate(['/products', id]);
//   }

//   getRating() {
//     return Rating;
//   }
// }

////////////////////////////////////////////////////////////////////////////////////////
// @Input() showCategories: boolean = true;
// @Input() limit: number | null = null;

// products: Product[] = [];
// isLoading = true;
// errorMsg = false;

// searchTerm = '';
// selectedCategory: string = 'All';
// categories: string[] = [];

// ngOnInit(): void {
//   const productSub = this.productService.getProducts().subscribe({
//     next: (res: any) => {
//       this.isLoading = false;
//       // this.products = res.products;

//       let products = res.products;

//       if (this.limit) {
//         products = products.slice(0, this.limit);
//       }

//       this.products = products;

//       // Category

//       if (this.showCategories) {
//         const categories = Array.from(new Set(this.products.map((p) => p.category)));
//         const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
//         this.categories = ['All', ...categories.map(capitalize)];
//       }

//       console.log(res);
//     },

//     error: (err) => {
//       this.errorMsg = true;
//       this.isLoading = false;
//       console.log(err);
//     },
//   });
//   this.destroyRef.onDestroy(() => {
//     productSub.unsubscribe();
//   });
// }

// get filteredProducts() {
//   const search = this.searchTerm.toLowerCase();
//   return this.products.filter((product) => {
//     const matchesSearch = product.title.toLowerCase().includes(search);

//     const matchesCategory =
//       this.selectedCategory === 'All' ||
//       product.category.toLowerCase() === this.selectedCategory.toLowerCase();
//     return matchesSearch && matchesCategory;
//   });
// }

// viewDetails(id: number): void {
//   this.router.navigate(['/products', id]);
// }

// get ratingUtil() {
//   return Rating;
// }
