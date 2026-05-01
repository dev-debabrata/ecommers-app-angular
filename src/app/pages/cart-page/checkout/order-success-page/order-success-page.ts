import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
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
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private orderService = inject(OrderService);
  private destroyRef = inject(DestroyRef);

  order: any = null;

  errorMsg = false;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    const userSub = this.authService.getFullUser().subscribe({
      next: (user: any) => {
        if (!user?.uid) return;

        const orderSub = this.orderService.getOrderById(user.uid, id).subscribe({
          next: (data) => {
            if (!data) return;

            this.order = {
              ...data,
              date: data.date?.toDate ? data.date.toDate() : data.date,
            };
          },

          error: (err) => {
            console.error('Order fetch error:', err);
            this.errorMsg = true;
          },
        });

        this.destroyRef.onDestroy(() => {
          orderSub.unsubscribe();
        });
      },

      error: (err) => {
        console.error('User fetch error:', err);
        this.errorMsg = true;
      },
    });

    this.destroyRef.onDestroy(() => {
      userSub.unsubscribe();
    });
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
