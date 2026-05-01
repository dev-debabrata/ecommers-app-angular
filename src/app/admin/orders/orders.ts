import { Component, inject, signal } from '@angular/core';
import { OrderService } from '../../services/order-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders {
  private orderService = inject(OrderService);

  orders = signal<any[]>([]);

  ngOnInit() {
    this.orderService.getAllOrders().subscribe((res) => {
      this.orders.set(res || []);
    });
  }

  changeStatus(order: any, event: Event) {
    const status = (event.target as HTMLSelectElement).value;

    this.orderService
      .updateOrderStatus(
        order.userId,
        order.userOrderId, // from Firestore
        order.id, // global order id
        status,
      )
      .subscribe({
        next: () => {
          // ✅ update UI instantly
          const updated = this.orders().map((o) => (o.id === order.id ? { ...o, status } : o));
          this.orders.set(updated);
        },
        error: (err) => console.log(err),
      });
  }
}
