import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-order-success-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-success-page.html',
  styleUrl: './order-success-page.css',
})
export class OrderSuccessPage {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  order: any = null;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    const data = localStorage.getItem('orders');

    if (data) {
      const orders = JSON.parse(data);

      this.order = orders.find((o: any) => o.id == id);
    }
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
