import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

import { OrderService } from '../../../services/order.service';
import { LoaderService } from '../../../services/loader.service';
import { Product } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-details.html',
  styleUrl: './order-details.css',
})
export class OrderDetails {
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);
  private productService = inject(ProductService);
  private loader = inject(LoaderService);
  private destroyRef = inject(DestroyRef);

  order = signal<any | null>(null);

  ngOnInit() {
    const orderId = this.route.snapshot.paramMap.get('id');
    const userId = this.route.snapshot.queryParamMap.get('userId');

    if (!orderId || !userId) return;

    this.loader.show();

    const sub = this.orderService.getOrderById(userId, orderId).subscribe({
      next: (res) => {
        console.log('ORDER DATA', res);
        this.order.set(res);
        this.loader.hide();
      },
      error: () => this.loader.hide(),
    });

    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  getDiscountPrice(item: Product): number {
    return this.productService.getDiscountPrice(item);
  }

  // ngOnInit() {
  //   const orderId = this.route.snapshot.paramMap.get('id');

  //   if (!orderId) return;

  //   this.loader.show();

  //   const sub = this.orderService.getOrderByIdAdmin(orderId).subscribe({
  //     next: (res) => {
  //       this.order.set(res);
  //       this.loader.hide();
  //     },
  //     error: () => this.loader.hide(),
  //   });

  //   this.destroyRef.onDestroy(() => sub.unsubscribe());
  // }
}
