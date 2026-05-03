import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { OrderService } from '../../services/order-service';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../../services/loader-service';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, MatIcon, MatPaginatorModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders {
  private orderService = inject(OrderService);
  private loaderService = inject(LoaderService);
  private destroyRef = inject(DestroyRef);

  sortDirection = signal<'asc' | 'desc'>('desc');
  // sortDirection = signal<'asc' | 'desc'>('asc');

  orders = signal<any[]>([]);

  pageIndex = signal(0);
  pageSize = signal(10);

  ngOnInit() {
    this.loaderService.show();

    const orderSub = this.orderService.getAllOrders().subscribe({
      next: (res) => {
        const sorted = (res || []).sort((a: any, b: any) => b.createdAt - a.createdAt);
        this.orders.set(sorted);
        this.loaderService.hide();
      },

      error: (err) => {
        console.log(err);
        this.loaderService.hide();
      },
    });

    this.destroyRef.onDestroy(() => {
      orderSub.unsubscribe();
    });

    // this.orderService.getAllOrders().subscribe((res) => {
    //   const sorted = (res || []).sort((a: any, b: any) => b.createdAt - a.createdAt);

    //   this.orders.set(sorted);
    //   // this.orders.set(res || []);
    // });
  }

  changeStatus(order: any, event: Event) {
    const status = (event.target as HTMLSelectElement).value;

    this.orderService
      .updateOrderStatus(order.userId, order.userOrderId, order.id, status)
      .subscribe({
        next: () => {
          const updated = this.orders().map((o) => (o.id === order.id ? { ...o, status } : o));
          this.orders.set(updated);
        },
        error: (err) => console.log(err),
      });
  }

  sortedOrders = computed(() => {
    const dir = this.sortDirection();

    return [...this.orders()].sort((a: any, b: any) => {
      const aVal = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bVal = b.createdAt ? new Date(b.createdAt).getTime() : 0;

      return dir === 'asc' ? aVal - bVal : bVal - aVal;
    });
  });

  totalItems = computed(() => this.orders().length);

  paginatedOrders = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    const end = start + this.pageSize();

    return this.sortedOrders().slice(start, end);
  });

  onPageChange(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  toggleSort() {
    this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    this.pageIndex.set(0);
  }
}
