import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../../models/products';
import { ProductService } from '../../../services/product-service';
import { Order, OrderItem } from '../../../models/order-item';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-history.html',
  styleUrl: './order-history.css',
})
export class OrderHistory {
  private router = inject(Router);
  private productService = inject(ProductService);

  orders = input<Order[]>([]);

  getDiscountPrice(item: OrderItem): number {
    return this.productService.getDiscountPrice(item);
  }

  // getDiscountPrice(item: OrderItem): number {
  //   if (!item.discount || item.discount === 0) return item.price;
  //   return item.price - (item.price * item.discount) / 100;
  // }

  // getDiscountPrice(item: Product): number {
  //   return this.productService.getDiscountPrice(item);
  // }

  viewProductDetails(productId: string) {
    this.router.navigate(['/products', productId]);
  }
}
