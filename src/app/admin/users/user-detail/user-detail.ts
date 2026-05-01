import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { UserService } from '../../../services/user-service';
import { OrderService } from '../../../services/order-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-detail',
  imports: [],
  templateUrl: './user-detail.html',
  styleUrl: './user-detail.css',
})
export class UserDetail implements OnInit {
  private userService = inject(UserService);
  private orderService = inject(OrderService);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  user = signal<any>(null);
  orders = signal<any[]>([]);

  errorMsg = false;

  activeSection: string = 'profile';

  ngOnInit() {
    const uid = this.route.snapshot.paramMap.get('uid');
    if (!uid) return;

    const userSub = this.userService.getUserById(uid).subscribe({
      next: (userData) => {
        this.user.set(userData);
      },

      error: (err) => {
        console.log('User fetch error: ', err);
        this.errorMsg = true;
      },
    });

    const orderSub = this.orderService.getUserOrders(uid).subscribe({
      next: (res) => {
        this.orders.set(res);
      },

      error: (err) => {
        console.log('Orders fetch error: ', err);
        this.errorMsg = true;
      },
    });

    this.destroyRef.onDestroy(() => {
      userSub.unsubscribe();
      orderSub.unsubscribe();
    });
  }
}

///////////////////////////////////////////////////////////////////////

// ngOnInit() {
//   const uid = this.route.snapshot.paramMap.get('uid');
//   if (!uid) return;

//   forkJoin({
//     user: this.userService.getUserById(uid),
//     orders: this.orderService.getUserOrders(uid),
//   })
//     .pipe(takeUntilDestroyed(this.destroyRef))
//     .subscribe(({ user, orders }) => {
//       this.user.set(user);
//       this.orders.set(orders);
//     });
// }
