import { Component, inject, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Navbar } from '../navbar/navbar';
import { AuthService } from '../../services/auth-service';
import { Breadcrumb } from '../breadcrumb/breadcrumb';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product-service';
import { CartService } from '../../services/cart-service';
import { Product } from '../../models/products';
import { WishlistService } from '../../services/wishlist-service';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,
    Navbar,
    MatIconModule,
    MatSnackBarModule,
    Breadcrumb,
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  @Input() hideBreadcrumb = false;
  private router = inject(Router);
  private authService = inject(AuthService);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);

  private snackBar = inject(MatSnackBar);

  itemCount = this.cartService.itemCount;
  wishlistCount = this.wishlistService.itemCount;

  searchTerm = '';
  suggestions: Product[] = [];
  activeIndex = 0;

  showMenu = false;
  openDropdownIndex: number | null = null;

  get isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  toggleMenu(event: MouseEvent) {
    event.stopPropagation();
    this.showMenu = !this.showMenu;
  }

  closeMenu() {
    this.showMenu = false;
  }

  logout() {
    this.authService.removeToken();
    this.showMenu = false;
    // this.cartService.clearCart();
    this.snackBar.open('Logged out successfully', 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['snackbar-success'],
    });

    this.router.navigate(['/']);
  }

  onInputChange() {
    this.activeIndex = 0;

    const term = this.searchTerm.toLowerCase().trim();

    if (!term) {
      this.suggestions = [];
      return;
    }

    this.productService.getProducts().subscribe((res: any) => {
      const products = res.products;

      this.suggestions = products
        .filter((p: Product) => p.title.toLowerCase().includes(term))
        .slice(0, 5);
    });
  }

  onKeyDown(event: KeyboardEvent) {
    if (!this.suggestions.length) return;

    if (event.key === 'ArrowDown') {
      this.activeIndex++;
      if (this.activeIndex >= this.suggestions.length) {
        this.activeIndex = 0;
      }
    }

    if (event.key === 'ArrowUp') {
      this.activeIndex--;
      if (this.activeIndex < 0) {
        this.activeIndex = 0;
      }
    }

    if (event.key === 'Enter') {
      if (this.suggestions.length > 0) {
        const product = this.suggestions[this.activeIndex];
        if (product) {
          this.selectProduct(product);
          return;
        }
      }

      this.searchProduct();
    }
  }

  selectProduct(product: Product) {
    // this.searchTerm = product.title;
    this.searchTerm = '';
    this.suggestions = [];

    this.router.navigate(['/products', product.id]);
  }

  searchProduct() {
    const term = this.searchTerm.toLowerCase().trim();

    if (!term) return;

    this.productService.getProducts().subscribe((res: any) => {
      const products = res.products;

      const match = products.find((p: Product) => p.title.toLowerCase().includes(term));

      if (match) {
        this.router.navigate(['/products', match.id]);
      } else {
        this.snackBar.open('Product not found', 'Close', {
          duration: 3000,
        });
      }
    });
  }
}

/////////////////////////////////////////////////////////////////////

// if (event.key === 'Enter') {
//   const product = this.suggestions[this.activeIndex];
//   if (product) {
//     this.selectProduct(product);
//   } else {
//     this.searchProduct();
//   }
// }

// onInputChange() {
//   this.activeIndex = 0;
//   const term = this.searchTerm.trim().toLowerCase();

//   if (!term) {
//     this.suggestions = [];
//     return;
//   }

//   let products = this.productService.getProductsCache();

//   if (products.length === 0) {
//     this.productService.getProducts().subscribe((res: any) => {
//       products = res.products;
//       this.productService.setProductsCache(products);
//       this.filterSuggestions(products, term);
//     });
//   } else {
//     this.filterSuggestions(products, term);
//   }
// }

// filterSuggestions(products: Product[], term: string) {
//   this.suggestions = products.filter((p) => p.title.toLowerCase().includes(term)).slice(0, 5);
// }

// onSearch() {
//   const term = this.searchTerm.trim().toLowerCase();
//   if (!term) return;

//   let products = this.productService.getProductsCache();

//   if (products.length === 0) {
//     this.productService.getProducts().subscribe((res: any) => {
//       products = res.products;
//       this.productService.setProductsCache(products);
//       this.findAndNavigate(products, term);
//     });
//   } else {
//     this.findAndNavigate(products, term);
//   }
// }

// findAndNavigate(products: Product[], term: string) {
//   const match = products.find((product) => product.title.toLowerCase().includes(term));

//   if (match) {
//     this.router.navigate(['/products', match.id]);

//     this.searchTerm = '';
//     this.suggestions = [];
//   } else {
//     this.snackBar.open('Product not found', 'Close', {
//       duration: 3000,
//       horizontalPosition: 'center',
//       verticalPosition: 'top',
//       panelClass: ['snackbar-error'],
//     });
//   }
// }
