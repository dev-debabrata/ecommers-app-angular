import { Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { AuthService } from '../../../services/auth-service';
import { OrderService } from '../../../services/order-service';
import { ProfileDetails } from '../profile-details/profile-details';
import { AddressBook } from '../address-book/address-book';
import { OrderHistory } from '../order-history/order-history';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, ProfileDetails, AddressBook, OrderHistory],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css',
})
export class ProfilePage {
  private authService = inject(AuthService);
  private orderService = inject(OrderService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  user: any = null;
  orders: any[] = [];

  activeSection = 'orders';

  async ngOnInit() {
    this.user = await this.authService.getFullUser();

    if (this.user?.uid) {
      const orderSub = this.orderService.getUserOrders(this.user.uid).subscribe((orders) => {
        this.orders = orders.map((o: any) => ({
          ...o,
          date: o.date?.toDate ? o.date.toDate() : o.date,
        }));
      });

      this.destroyRef.onDestroy(() => {
        orderSub.unsubscribe();
      });
    }
  }

  changeSection(section: string) {
    this.activeSection = section;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

// import { Component, DestroyRef, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Router } from '@angular/router';

// import { AuthService } from '../../../services/auth-service';
// import { OrderService } from '../../../services/order-service';

// @Component({
//   selector: 'app-profile-page',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './profile-page.html',
//   styleUrl: './profile-page.css',
// })
// export class ProfilePage {
//   private authService = inject(AuthService);
//   private orderService = inject(OrderService);
//   private router = inject(Router);
//   private destroyRef = inject(DestroyRef);

//   user: any = null;
//   orders: any[] = [];

//   activeSection = 'orders';

//   async ngOnInit() {
//     this.user = await this.authService.getFullUser();

//     if (this.user?.uid) {
//       const orderSub = this.orderService.getUserOrders(this.user.uid).subscribe((orders) => {
//         this.orders = orders.map((o: any) => ({
//           ...o,
//           date: o.date?.toDate ? o.date.toDate() : o.date,
//         }));
//       });

//       this.destroyRef.onDestroy(() => {
//         orderSub.unsubscribe();
//       });
//     }
//   }

//   changeSection(section: string) {
//     this.activeSection = section;
//   }

//   logout() {
//     this.authService.logout();
//     this.router.navigate(['/login']);
//   }

//   viewProductDetails(productId: number) {
//     this.router.navigate(['/products', productId]);
//   }
// }

///////////////////////////////////////////////////////////////

// async ngOnInit() {
//   this.user = await this.authService.getFullUser();

//   if (this.user?.uid) {
//     this.orderService
//       .getUserOrders(this.user.uid)
//       .pipe(takeUntilDestroyed(this.destroyRef))
//       .subscribe((orders) => {
//         this.orders = orders.map((o: any) => ({
//           ...o,
//           date: o.date?.toDate ? o.date.toDate() : o.date,
//         }));
//       });
//   }
// }
