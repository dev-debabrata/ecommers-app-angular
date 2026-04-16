import { Component, DestroyRef, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ProductService } from '../../../services/product-service';
import { Product } from '../../../models/products';
import { Rating } from '../../../utils/rating.util';
import { Error } from '../../../components/error/error';
import { TruncatePipe } from '../../../pipes/truncate-pipe';
import { Loader } from '../../../components/loader/loader';
import { Highlight } from '../../../directives/highlight';

@Component({
  selector: 'app-product-list-page',
  standalone: true,
  imports: [CommonModule, FormsModule, TruncatePipe, Highlight, Loader, Error],
  templateUrl: './product-list-page.html',
  styleUrl: './product-list-page.css',
})
export class ProductListPage {
  private router = inject(Router);
  private productService = inject(ProductService);
  private destroyRef = inject(DestroyRef);

  @Input() showCategories: boolean = true;
  @Input() limit: number | null = null;

  products: Product[] = [];
  isLoading = true;
  errorMsg = false;

  searchTerm = '';
  selectedCategory = 'All';
  categories: string[] = [];

  ngOnInit(): void {
    const productSub = this.productService.getProducts().subscribe({
      next: (res: any) => {
        this.isLoading = false;

        let products = res.products;

        if (this.limit) {
          products = products.slice(0, this.limit);
        }

        this.products = products;

        if (this.showCategories) {
          const cats = this.products.map((p) => p.category);

          const uniqueCats = Array.from(new Set(cats));

          this.categories = ['All', ...uniqueCats];
        }
        console.log(res);
      },

      error: () => {
        this.isLoading = false;
        this.errorMsg = true;
      },
    });
    this.destroyRef.onDestroy(() => {
      productSub.unsubscribe();
    });
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

  viewDetails(id: number) {
    this.router.navigate(['/products', id]);
  }

  getRating() {
    return Rating;
  }
}

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
