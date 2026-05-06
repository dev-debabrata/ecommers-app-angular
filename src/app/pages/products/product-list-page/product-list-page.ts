import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';
import { Rating } from '../../../utils/rating.util';
import { Error } from '../../../components/error/error';
import { TruncatePipe } from '../../../pipes/truncate-pipe';
import { Highlight } from '../../../directives/highlight';
import { WishlistService } from '../../../services/wishlist.service';
import { AuthService } from '../../../services/auth.user.service';
import { LoaderService } from '../../../services/loader.service';
import { SnackbarService } from '../../../services/snackbar.service';

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
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private wishlistService = inject(WishlistService);
  private destroyRef = inject(DestroyRef);
  private loaderService = inject(LoaderService);
  private snackBar = inject(SnackbarService);

  @Input() showCategories = true;
  @Input() showWishlistIcon = true;

  products: Product[] = [];
  errorMsg = false;

  searchTerm = '';

  selectedMainCategory = 'all';
  selectedCategory = 'all';

  minDiscount = 0;

  ngOnInit(): void {
    this.loaderService.show();

    const paramSub = this.route.queryParams.subscribe((params) => {
      this.selectedMainCategory = (params['main'] || 'all').toLowerCase().trim();
      this.selectedCategory = (params['category'] || 'all').toLowerCase().trim();
      this.minDiscount = params['discount'] ? Number(params['discount']) : 0;
    });

    this.destroyRef.onDestroy(() => paramSub.unsubscribe());

    const productSub = this.productService.getProducts().subscribe({
      next: (res: Product[]) => {
        this.products = [...res].sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0));

        this.loaderService.hide();
      },
      error: (err) => {
        this.errorMsg = true;
        this.loaderService.hide();
        console.log(err);
      },
    });

    this.destroyRef.onDestroy(() => {
      productSub.unsubscribe();
    });
  }

  getCategories(): string[] {
    const filtered =
      this.selectedMainCategory === 'all'
        ? this.products
        : this.products.filter(
            (p) => p.category?.toLowerCase().trim() === this.selectedMainCategory,
          );

    const subCats = filtered.map((p) => p.subCategory?.toLowerCase().trim()).filter(Boolean);

    return ['all', ...Array.from(new Set(subCats))];
  }

  getFilteredProducts(): Product[] {
    const search = this.searchTerm.toLowerCase();

    return this.products.filter((product) => {
      const matchesSearch = product.title.toLowerCase().includes(search);

      const matchesMain =
        this.selectedMainCategory === 'all' ||
        product.category?.toLowerCase().trim() === this.selectedMainCategory;

      const matchesSub =
        this.selectedCategory === 'all' ||
        product.subCategory?.toLowerCase().trim() === this.selectedCategory;

      const matchesDiscount = (product.discount || 0) >= this.minDiscount;

      return matchesSearch && matchesMain && matchesSub && matchesDiscount;
    });
  }

  goToMainCategory(cat: string) {
    this.selectedMainCategory = cat.toLowerCase();
    this.selectedCategory = 'all';

    this.router.navigate(['/products'], {
      queryParams: {
        main: this.selectedMainCategory,
        category: 'all',
      },
    });
  }

  goToSubCategory(sub: string) {
    this.selectedCategory = sub.toLowerCase();

    this.router.navigate(['/products'], {
      queryParams: {
        main: this.selectedMainCategory,
        category: this.selectedCategory,
      },
    });
  }

  getDiscountPrice(item: Product): number {
    return this.productService.getDiscountPrice(item);
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
/////////////////////////////////////////////////////////////////////////////
// other version

// private authService = inject(AuthService);
// private router = inject(Router);
// private route = inject(ActivatedRoute);
// private productService = inject(ProductService);
// private wishlistService = inject(WishlistService);
// private destroyRef = inject(DestroyRef);
// private loaderService = inject(LoaderService);
// private snackBar = inject(SnackbarService);

// @Input() showCategories = true;
// @Input() showWishlistIcon = true;

// products: Product[] = [];
// errorMsg = false;
// minDiscount = 0;

// searchTerm = '';
// selectedCategory = 'All';
// categories: string[] = [];

// ngOnInit(): void {
//   this.loaderService.show();

//   const paramSub = this.route.queryParams.subscribe((params) => {
//     const category = params['category'];
//     const discount = params['discount'];

//     this.selectedCategory = (category || 'all').toLowerCase().trim();
//     this.minDiscount = discount ? Number(discount) : 0;
//   });

//   this.destroyRef.onDestroy(() => {
//     paramSub.unsubscribe();
//   });

//   const productSub = this.productService.getProducts().subscribe({
//     next: (res: Product[]) => {
//       const sorted = [...res].sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0));

//       this.products = sorted;

//       if (this.showCategories) {
//         const cats = this.products.map((p) => p.category?.toLowerCase().trim()).filter(Boolean);

//         const uniqueCats = Array.from(new Set(cats));

//         this.categories = ['all', ...uniqueCats];
//         // const cats = this.products.map((p) => p.category);
//         // const uniqueCats = Array.from(new Set(cats));
//         // this.categories = ['All', ...uniqueCats];
//       }

//       console.log(res);
//       this.loaderService.hide();
//     },

//     error: (err) => {
//       this.loaderService.hide();
//       this.errorMsg = true;
//       console.log(err);
//     },
//   });

//   this.destroyRef.onDestroy(() => {
//     productSub.unsubscribe();
//   });
// }

// // ngOnInit(): void {
// //   this.loaderService.show();

// //   const productSub = this.productService.getProducts().subscribe({
// //     next: (res: Product[]) => {
// //       const sorted = [...res].sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0));

// //       this.products = sorted;

// //       if (this.showCategories) {
// //         const cats = this.products.map((p) => p.category);
// //         const uniqueCats = Array.from(new Set(cats));
// //         this.categories = ['All', ...uniqueCats];
// //       }
// //       this.loaderService.hide();
// //       console.log(res);
// //     },

// //     error: () => {
// //       this.loaderService.hide();
// //       this.errorMsg = true;
// //     },
// //   });

// //   this.destroyRef.onDestroy(() => {
// //     productSub.unsubscribe();
// //   });
// // }

// getDiscountPrice(item: Product): number {
//   return this.productService.getDiscountPrice(item);
// }

// getFilteredProducts(): Product[] {
//   const search = this.searchTerm.toLowerCase();

//   return this.products.filter((product) => {
//     const matchesSearch = product.title.toLowerCase().includes(search);

//     const matchesCategory =
//       this.selectedCategory === 'all' ||
//       product.category?.toLowerCase() === this.selectedCategory;

//     const matchesDiscount = (product.discount || 0) >= this.minDiscount;

//     return matchesSearch && matchesCategory && matchesDiscount;
//   });
// }

// // getFilteredProducts(): Product[] {
// //   const search = this.searchTerm.toLowerCase();

// //   return this.products.filter((product) => {
// //     const matchesSearch = product.title.toLowerCase().includes(search);

// //     const matchesCategory =
// //       this.selectedCategory === 'All' || product.category === this.selectedCategory;

// //     return matchesSearch && matchesCategory;
// //   });
// // }

// isWishlisted(productId: string): boolean {
//   return this.authService.isLoggedIn() && this.wishlistService.isInWishlist(productId);
// }

// addToWishlist(product: Product) {
//   if (!this.authService.isLoggedIn()) {
//     this.router.navigate(['/login']);
//     return;
//   }

//   if (this.wishlistService.isInWishlist(product.id!)) {
//     this.wishlistService.removeFromWishlist(product.id!);
//     this.snackBar.error('Removed from wishlist');
//   } else {
//     this.wishlistService.addToWishlist(product);
//     this.snackBar.success('Added to wishlist');
//   }
// }

// viewDetails(id: string) {
//   this.router.navigate(['/products', id]);
// }

// onCategoryChange() {
//   this.router.navigate([], {
//     relativeTo: this.route,
//     queryParams: {
//       category: this.selectedCategory,
//       discount: this.minDiscount || null,
//     },
//     queryParamsHandling: 'merge',
//   });
// }

// // onCategoryChange() {
// //   this.getFilteredProducts();
// // }

// getRating() {
//   return Rating;
// }

//////////////////////////////////////////////////////////////////////////////

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
