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
  private snackBar = inject(MatSnackBar);

  private cartService = inject(CartService);

  itemCount = this.cartService.itemCount;

  searchTerm = '';
  suggestions: any[] = [];

  showMenu = false;
  openDropdownIndex: number | null = null;

  get isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  toggleMenu(event: MouseEvent) {
    event.stopPropagation();
    this.showMenu = !this.showMenu;
  }

  // toggleMenu() {
  //   this.showMenu = !this.showMenu;
  // }

  closeMenu() {
    this.showMenu = false;
  }

  logout() {
    this.authService.removeToken();
    this.showMenu = false;

    this.snackBar.open('Logged out successfully', 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['snackbar-success'],
    });

    this.router.navigate(['/']);
  }

  onInputChange() {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      this.suggestions = [];
      return;
    }

    let products = this.productService.getProductsCache();

    if (products.length === 0) {
      this.productService.getProducts().subscribe((res: any) => {
        products = res.products;
        this.productService.setProductsCache(products);
        this.filterSuggestions(products, term);
      });
    } else {
      this.filterSuggestions(products, term);
    }
  }

  filterSuggestions(products: any[], term: string) {
    this.suggestions = products.filter((p) => p.title.toLowerCase().includes(term)).slice(0, 5);
  }

  selectProduct(product: any) {
    // this.searchTerm = product.title;
    this.searchTerm = '';
    this.suggestions = [];

    this.router.navigate(['/products', product.id]);
  }

  onSearch() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return;

    let products = this.productService.getProductsCache();

    if (products.length === 0) {
      this.productService.getProducts().subscribe((res: any) => {
        products = res.products;
        this.productService.setProductsCache(products);
        this.findAndNavigate(products, term);
      });
    } else {
      this.findAndNavigate(products, term);
    }
  }

  findAndNavigate(products: any[], term: string) {
    const match = products.find((product) => product.title.toLowerCase().includes(term));

    if (match) {
      this.router.navigate(['/products', match.id]);

      this.searchTerm = '';
      this.suggestions = [];
    } else {
      this.snackBar.open('Product not found', 'Close', {
        duration: 3000,
      });
    }
  }
}

// findAndNavigate(products: any[], term: string) {
//   const match = products.find((product) => product.title.toLowerCase().includes(term));

//   if (match) {
//     this.router.navigate(['/products', match.id]);
//   } else {
//     this.snackBar.open('Product not found', 'Close', {
//       duration: 3000,
//     });
//   }
// }

// onSearch() {
//   const products = this.productService.getProductsCache();

//   const match = products.find((p: any) =>
//     p.title.toLowerCase().includes(this.searchTerm.toLowerCase()),
//   );

//   if (match) {
//     this.router.navigate(['/products', match.id]);
//   } else {
//     alert('Product not found');
//   }
// }
