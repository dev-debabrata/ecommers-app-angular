import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../services/auth-service';
import { OrderService } from '../../../../services/order-service';

@Component({
  selector: 'app-order-success-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-success-page.html',
  styleUrl: './order-success-page.css',
})
export class OrderSuccessPage implements OnInit {
  order: any = null;

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private orderService = inject(OrderService);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    this.authService.getFullUser().then((user: any) => {
      if (!user?.uid || !id) return;

      this.orderService.getOrderById(user.uid, id).subscribe((data) => {
        if (!data) return;

        this.order = {
          ...data,
          date: data.date?.toDate ? data.date.toDate() : data.date,
        };
      });
    });
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
