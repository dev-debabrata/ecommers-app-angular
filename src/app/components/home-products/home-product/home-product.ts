import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ProductService } from '../../../services/product-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Product } from '../../../models/products';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home-product',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './home-product.html',
  styleUrl: './home-product.css',
})
export class HomeProduct implements OnInit {
  private productService = inject(ProductService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  products = signal<Product[]>([]);
  currentIndex = signal(0);

  visibleCount = 8;

  visibleProducts = computed(() => {
    const start = this.currentIndex();
    const end = start + this.visibleCount;
    return this.products().slice(start, end);
  });

  ngOnInit() {
    const sub = this.productService.getProducts().subscribe((res: Product[]) => {
      const sorted = [...res].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

      this.products.set(sorted);
    });

    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  next() {
    const maxIndex = this.products().length - this.visibleCount;

    if (this.currentIndex() < maxIndex) {
      this.currentIndex.set(Math.min(this.currentIndex() + this.visibleCount, maxIndex));
    }
  }

  prev() {
    if (this.currentIndex() > 0) {
      this.currentIndex.set(Math.max(this.currentIndex() - this.visibleCount, 0));
    }
  }

  viewDetails(id: string) {
    this.router.navigate(['/products', id]);
  }
}
