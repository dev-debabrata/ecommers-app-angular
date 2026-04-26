import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product-service';
import { Product } from '../../../models/products';
import { TruncatePipe } from '../../../pipes/truncate-pipe';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [RouterLink, MatIcon, TruncatePipe, MatPaginatorModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  private productService = inject(ProductService);
  private destroyRef = inject(DestroyRef);

  products = signal<Product[]>([]);
  searchTerm = signal('');

  pageSize = 5;
  pageIndex = 0;

  ngOnInit() {
    const sub = this.productService.getProducts().subscribe((res) => {
      this.products.set(res);
    });

    this.destroyRef.onDestroy(() => {
      sub.unsubscribe();
    });
  }

  deleteProduct(id: string) {
    this.productService.deleteProduct(id);
  }

  filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase();

    return this.products().filter((product) => product.title.toLowerCase().includes(term));
  });

  updateSearch(value: string) {
    this.searchTerm.set(value);
  }

  get paginatedProducts() {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;

    return this.filteredProducts().slice(start, end);
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }
}
