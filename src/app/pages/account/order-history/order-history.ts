import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-history.html',
  styleUrl: './order-history.css',
})
export class OrderHistory {
  private router = inject(Router);

  orders = input<any[]>([]);

  viewProductDetails(productId: string) {
    this.router.navigate(['/products', productId]);
  }
}
