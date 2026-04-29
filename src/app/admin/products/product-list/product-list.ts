import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product-service';
import { Product } from '../../../models/products';
import { TruncatePipe } from '../../../pipes/truncate-pipe';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [RouterLink, CommonModule, MatIcon, TruncatePipe, MatPaginatorModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  private productService = inject(ProductService);
  private destroyRef = inject(DestroyRef);

  products = signal<Product[]>([]);
  searchTerm = signal('');
  sortDirection = signal<'asc' | 'desc'>('asc');

  pageSize = 5;
  pageIndex = 0;

  totalItems = computed(() => this.filteredProducts().length);

  ngOnInit() {
    const sub = this.productService.getProducts().subscribe({
      next: (res) => {
        this.products.set(res || []);
      },
      error: (err) => {
        console.error('Product load error:', err);
        this.products.set([]);
      },
    });

    this.destroyRef.onDestroy(() => {
      sub.unsubscribe();
    });
  }

  // ngOnInit() {
  //   const sub = this.productService.getProducts().subscribe({
  //     next: (res) => {
  //       if (!res) {
  //         this.products.set([]);
  //         return;
  //       }

  //       const sorted = [...res].sort((a: any, b: any) => (a.createdAt || 0) - (b.createdAt || 0));

  //       this.products.set(sorted);
  //     },

  //     error: (err) => {
  //       console.error('Product load error:', err);
  //       this.products.set([]);
  //     },
  //   });

  //   this.destroyRef.onDestroy(() => {
  //     sub.unsubscribe();
  //   });
  // }

  // ngOnInit() {
  //   const sub = this.productService.getProducts().subscribe((res) => {
  //     this.products.set(res);
  //   });

  //   this.destroyRef.onDestroy(() => {
  //     sub.unsubscribe();
  //   });
  // }

  filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase();

    return this.products().filter((product) => product.title?.toLowerCase().includes(term));
  });

  sortedProducts = computed(() => {
    const direction = this.sortDirection();

    return [...this.filteredProducts()].sort((a: any, b: any) => {
      const aVal = a.createdAt?.seconds || a.createdAt || 0;
      const bVal = b.createdAt?.seconds || b.createdAt || 0;

      return direction === 'asc' ? aVal - bVal : bVal - aVal;
    });
  });

  get paginatedProducts() {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;

    return this.sortedProducts().slice(start, end);
  }

  updateSearch(value: string) {
    this.searchTerm.set(value);
    this.pageIndex = 0;
  }

  toggleSort() {
    this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  getDiscountPrice(product: Product): number {
    if (!product.discount || product.discount <= 0) {
      return product.price;
    }

    return product.price - (product.price * product.discount) / 100;
  }

  deleteProduct(id: string) {
    this.productService.deleteProduct(id);
  }
}
