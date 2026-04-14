import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TruncatePipe } from '../../../pipes/truncate-pipe';
import { Loader } from '../../../components/loader/loader';
import { Router } from '@angular/router';
import { ProductService } from '../../../services/product-service';
import { Product } from '../../../models/products';
import { Rating } from '../../../utils/rating.util';
import { Error } from '../../../components/error/error';
import { Highlight } from '../../../directives/highlight';

@Component({
  selector: 'app-product-list-page',
  standalone: true,
  imports: [CommonModule, FormsModule, TruncatePipe, Highlight, Loader, Error],
  templateUrl: './product-list-page.html',
  styleUrl: './product-list-page.css',
})
export class ProductListPage {
  // Get Router & ProductService
  private router = inject(Router);
  private productService = inject(ProductService);

  // Automatic cleanup
  private destroyRef = inject(DestroyRef);

  @Input() showCategories: boolean = true;
  @Input() limit: number | null = null;

  // Component State
  products: Product[] = [];
  isLoading = true;
  errorMsg = false;

  // Search and Filter
  searchTerm = '';
  selectedCategory: string = 'All';
  categories: string[] = [];

  // ProductService to Fatch Products
  ngOnInit(): void {
    const productSub = this.productService.getProducts().subscribe({
      next: (res: any) => {
        this.isLoading = false;
        // this.products = res.products;

        let products = res.products;

        // ✅ LIMIT FOR HOME PAGE
        if (this.limit) {
          products = products.slice(0, this.limit);
        }

        this.products = products;

        // Category

        if (this.showCategories) {
          const categories = Array.from(new Set(this.products.map((p) => p.category)));
          const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
          this.categories = ['All', ...categories.map(capitalize)];
        }
        // const categories = Array.from(new Set(this.products.map((p) => p.category)));
        // // this.categories = ['All', ...new Set(this.products.map((p) => p.category))];
        // const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
        // this.categories = ['All', ...categories.map(capitalize)];

        console.log(res);
        // console.log('isLoading:', this.isLoading);
      },

      error: (err) => {
        this.errorMsg = true;
        this.isLoading = false;
        console.log(err);
      },
    });
    // Automatically Component Destroyed
    this.destroyRef.onDestroy(() => {
      productSub.unsubscribe();
    });
  }

  // Products search and selected category
  get filteredProducts() {
    const search = this.searchTerm.toLowerCase();
    return this.products.filter((product) => {
      const matchesSearch = product.title.toLowerCase().includes(search);

      const matchesCategory =
        this.selectedCategory === 'All' ||
        product.category.toLowerCase() === this.selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
      // const matchesCategory =
      //   this.selectedCategory === 'All' || product.category === this.selectedCategory;
      // return matchesSearch && matchesCategory;
    });
  }

  // Navigate to product details page
  viewDetails(id: number): void {
    this.router.navigate(['/products', id]);
  }

  // Rating
  get ratingUtil() {
    return Rating;
  }
}
