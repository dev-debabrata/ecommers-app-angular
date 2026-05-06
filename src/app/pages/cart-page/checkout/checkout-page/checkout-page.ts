import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { CartService } from '../../../../services/cart.service';
import { AuthService } from '../../../../services/auth.user.service';
import { TruncatePipe } from '../../../../pipes/truncate.pipe';
import { OrderService } from '../../../../services/order.service';
import { LoaderService } from '../../../../services/loader.service';
import { SnackbarService } from '../../../../services/snackbar.service';
import { CartItem } from '../../../../models/cart.model';
import { CheckoutAddress } from '../checkout-address/checkout-address';
import { Order, OrderAddress } from '../../../../models/order.model';

import { User } from '../../../../models/user.model';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, TruncatePipe, CheckoutAddress],
  templateUrl: './checkout-page.html',
  styleUrl: './checkout-page.css',
})
export class CheckoutPage implements OnInit {
  public cartService = inject(CartService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private orderService = inject(OrderService);
  private destroyRef = inject(DestroyRef);
  private loaderService = inject(LoaderService);
  private snackbar = inject(SnackbarService);

  user = signal<User | null>(null);
  selectedAddress = signal<OrderAddress | null>(null);

  checkoutForm = signal<{ shippingMethod: 'free' | 'express' }>({
    shippingMethod: 'free',
  });

  ngOnInit(): void {
    if (this.cartService.cart().length === 0) {
      this.router.navigate(['/']);
      return;
    }

    const sub = this.authService.getFullUser().subscribe({
      next: (user) => {
        if (!user) return;

        this.user.set(user);
      },
      error: (err) => {
        console.error('User fetch error:', err);
      },
    });

    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  onAddressSelect(addr: OrderAddress) {
    this.selectedAddress.set(addr);
  }

  setShippingMethod(method: 'free' | 'express') {
    this.checkoutForm.update((f) => ({ ...f, shippingMethod: method }));
  }

  getDiscountPrice(item: CartItem): number {
    return this.cartService.getDiscountPrice(item);
  }

  shippingPrice = computed(() => (this.checkoutForm().shippingMethod === 'express' ? 90 : 0));

  subTotal = computed(() => this.cartService.totalPrice());

  gst = computed(() => Math.round(this.subTotal() * 0.18));

  totalPrice = computed(() => this.subTotal() + this.gst() + this.shippingPrice());

  submitOrder() {
    const address = this.selectedAddress();
    const user = this.user();

    if (!address) {
      this.snackbar.error('Please select a delivery address!');
      return;
    }

    if (!user?.uid) {
      this.snackbar.error('User not found. Please login again!');
      return;
    }

    this.loaderService.show();

    const uid = user.uid as string;

    const order: Omit<Order, 'id' | 'status'> = {
      userId: uid,
      userEmail: user.email,
      address,
      shippingMethod: this.checkoutForm().shippingMethod,
      items: this.cartService.cart().map((item) => ({
        productId: item.id,
        title: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        discount: item.discount || 0,
      })),
      subTotal: this.subTotal(),
      gst: this.gst(),
      total: this.totalPrice(),
      createdAt: Date.now(),
    };

    const orderSub = this.orderService.createOrder(uid, order as Order).subscribe({
      next: (res: Order) => {
        this.loaderService.hide();
        this.cartService.clearCart();
        this.snackbar.success('Order placed successfully!');
        this.router.navigate(['/order-success', res.id]);
      },
      error: (err) => {
        this.loaderService.hide();
        this.snackbar.error('Order failed! Please try again.');
        console.error(err);
      },
    });

    this.destroyRef.onDestroy(() => orderSub.unsubscribe());
  }
}

///////////////////////////////////////////////////////////////////////////////////////////

// import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import {
//   FormControl,
//   FormGroup,
//   FormsModule,
//   ReactiveFormsModule,
//   Validators,
// } from '@angular/forms';
// import { Router } from '@angular/router';

// import { CartService } from '../../../../services/cart-service';
// import { AuthService } from '../../../../services/auth-service';
// import { TruncatePipe } from '../../../../pipes/truncate-pipe';
// import { OrderService } from '../../../../services/order-service';
// import { LoaderService } from '../../../../services/loader-service';
// import { SnackbarService } from '../../../../services/snackbar-service';
// import { CartItem } from '../../../../models/cart-item';
// import { CheckoutAddress } from '../checkout-address/checkout-address';
// import { Order } from '../../../../models/order-item';

// @Component({
//   selector: 'app-checkout-page',
//   standalone: true,
//   imports: [FormsModule, ReactiveFormsModule, CommonModule, TruncatePipe, CheckoutAddress],
//   templateUrl: './checkout-page.html',
//   styleUrl: './checkout-page.css',
// })
// export class CheckoutPage implements OnInit {
//   public cartService = inject(CartService);
//   private authService = inject(AuthService);
//   private router = inject(Router);
//   private orderService = inject(OrderService);
//   private destroyRef = inject(DestroyRef);
//   private loaderService = inject(LoaderService);
//   private snackbar = inject(SnackbarService);

//   user = signal<any>(null);
//   selectedAddress = signal<any>(null);

//   checkoutForm = signal({
//     shippingMethod: 'free',
//   });

//   ngOnInit(): void {
//     if (this.cartService.cart().length === 0) {
//       this.router.navigate(['/']);
//       return;
//     }

//     // const item = localStorage.getItem('buyNowItem');

//     // if (item) {
//     //   this.buyNowItem = JSON.parse(item);
//     // }

//     // if (this.cartService.cart().length === 0 && !this.buyNowItem) {
//     //   this.router.navigate(['/']);
//     //   return;
//     // }

//     const sub = this.authService.getFullUser().subscribe({
//       next: (user: any) => {
//         if (user) {
//           this.user.set(user);

//           this.checkoutForm.update((form) => ({
//             ...form,
//             fullName: user.firstName + ' ' + user.lastName,
//             email: user.email,
//             phone: user.phoneNumber?.[0] || '',
//           }));
//         }
//       },
//       // next: (user: any) => {
//       //   if (user) {
//       //     this.checkoutForm.update((form) => ({
//       //       ...form,
//       //       fullName: user.firstName + ' ' + user.lastName,
//       //       email: user.email,
//       //       phone: user.phoneNumber || '',
//       //     }));
//       //   }
//       // },

//       error: (err) => {
//         console.error('User fetch error:', err);
//       },
//     });

//     this.destroyRef.onDestroy(() => {
//       sub.unsubscribe();
//     });
//   }

//   onAddressSelect(addr: any) {
//     this.selectedAddress.set(addr);
//   }

//   setShippingMethod(method: 'free' | 'express') {
//     this.checkoutForm.update((f) => ({
//       ...f,
//       shippingMethod: method,
//     }));
//   }

//   getDiscountPrice(item: CartItem): number {
//     return this.cartService.getDiscountPrice(item);
//   }

//   shippingPrice = computed(() => (this.checkoutForm().shippingMethod === 'express' ? 90 : 0));

//   subTotal = computed(() => {
//     return this.cartService.totalPrice();
//   });

//   gst = computed(() => Math.round(this.subTotal() * 0.18));

//   // gst = computed(() => this.subTotal() * 0.18);

//   totalPrice = computed(() => this.subTotal() + this.gst() + this.shippingPrice());

//   submitOrder() {
//     if (!this.selectedAddress()) {
//       this.snackbar.error('Select address first!');
//       return;
//     }

//     const user = this.user();
//     if (!user?.uid) {
//       this.snackbar.error('User not found!');
//       return;
//     }

//     this.loaderService.show();

//     const order: Order = {
//       userEmail: user.email,
//       userId: user.uid,
//       address: this.selectedAddress(),
//       shippingMethod: this.checkoutForm().shippingMethod,
//       items: this.cartService.cart().map((item) => ({
//         productId: item.id,
//         title: item.name,
//         image: item.image,
//         price: item.price,
//         quantity: item.quantity,
//       })),
//       subTotal: this.subTotal(),
//       gst: this.gst(),
//       total: this.totalPrice(),
//       status: 'pending',
//       createdAt: Date.now(),
//     };

//     const orderSub = this.orderService.createOrder(user.uid, order).subscribe({
//       next: (res: any) => {
//         this.loaderService.hide();

//         this.cartService.clearCart();
//         this.snackbar.success('Order placed!');
//         this.router.navigate(['/order-success', res.id]);
//       },

//       error: (err) => {
//         this.loaderService.hide();
//         this.snackbar.error('Order failed!');
//         console.log(err);
//       },
//     });

//     this.destroyRef.onDestroy(() => {
//       orderSub.unsubscribe();
//     });
//   }
// }

// submitted = signal(false);
// touchedFields = signal<Record<string, boolean>>({});

// fullName: '',
// email: '',
// phone: '',
// address: '',
// landmark: '',
// city: '',
// state: '',
// pinCode: '',

// markTouched(field: string) {
//   this.touchedFields.update((touch) => ({
//     ...touch,
//     [field]: true,
//   }));
// }

// updateField(field: string, value: string) {
//   this.checkoutForm.update((form) => ({ ...form, [field]: value }));
// }

// isInvalid(field: keyof ReturnType<typeof this.checkoutForm>) {
//   return (this.submitted() || this.touchedFields()[field]) && !this.checkoutForm()[field];
// }

// isFormValid() {
//   const form = this.checkoutForm();
//   return (
//     form.fullName &&
//     form.email &&
//     form.phone &&
//     form.address &&
//     form.landmark &&
//     form.city &&
//     form.state &&
//     form.pinCode
//   );
// }

// submitOrder() {
//   this.submitted.set(true);

//   if (!this.isFormValid()) {
//     this.snackbar.error('Please fill all required fields correctly!');
//     document.querySelector('.checkout-left')?.scrollIntoView({ behavior: 'smooth' });
//     return;
//   }

//   this.loaderService.show();

//   const userSub = this.authService.getFullUser().subscribe({
//     next: (user: any) => {
//       if (!user?.uid) {
//         this.snackbar.error('User not logged in!');
//         this.loaderService.hide();
//         return;
//       }

//       const items = [...this.cartService.cart(), ...(this.buyNowItem ? [this.buyNowItem] : [])];

//       const order = {
//         address: this.checkoutForm(),
//         items,
//         subTotal: this.subTotal(),
//         gst: this.gst(),
//         total: this.totalPrice(),
//         date: new Date(),
//         status: 'placed',
//       };

//       const orderSub = this.orderService.createOrder(user.uid, order).subscribe({
//         next: (docRef: any) => {
//           // clear cart
//           this.buyNowItem = null;
//           localStorage.removeItem('buyNowItem');
//           this.cartService.clearCart();

//           this.snackbar.success('Order placed successfully!');
//           this.loaderService.hide();

//           this.router.navigate(['/order-success', docRef.id]);
//         },

//         error: (err) => {
//           console.error(err);
//           this.snackbar.error('Failed to place order!');
//           this.loaderService.hide();
//         },
//       });

//       this.destroyRef.onDestroy(() => {
//         orderSub.unsubscribe();
//       });
//     },

//     error: (err) => {
//       console.error(err);
//       this.snackbar.error('User fetch failed!');
//       this.loaderService.hide();
//     },
//   });

//   this.destroyRef.onDestroy(() => {
//     userSub.unsubscribe();
//   });
// }

///////////////////////////////////////////////////////////////////////////////////

// async submitOrder() {
//   this.submitted.set(true);

//   if (!this.isFormValid()) {
//     this.snackbar.error('Please fill all required fields correctly!');

//     document.querySelector('.checkout-left')?.scrollIntoView({ behavior: 'smooth' });
//     return;
//   }

//   const user: any = await this.authService.getFullUser();
//   if (!user?.uid) {
//     this.snackbar.error('User not logged in!');
//     return;
//   }

//   const items = [...this.cartService.cart(), ...(this.buyNowItem ? [this.buyNowItem] : [])];

//   const order = {
//     address: this.checkoutForm(),
//     items,
//     subTotal: this.subTotal(),
//     gst: this.gst(),
//     total: this.totalPrice(),
//     date: new Date(),
//     status: 'placed',
//   };

//   this.loaderService.show();

//   try {
//     const docRef = await this.orderService.createOrder(user.uid, order);

//     this.buyNowItem = null;
//     localStorage.removeItem('buyNowItem');
//     await this.cartService.clearCart();

//     this.snackbar.success('Order placed successfully!');
//     this.loaderService.hide();

//     this.router.navigate(['/order-success', docRef.id]);
//   } catch (error) {
//     console.error(error);
//     this.snackbar.error('Failed to place order!');
//     this.loaderService.hide();
//   }
// }

///////////////////////////////////////////////////////////////////////////////////

// This is Reactive Form type
//////////////////////////////////////////////////////////////////////////////////////////////////////
// public cartService = inject(CartService);
// private authService = inject(AuthService);
// private router = inject(Router);

// private snackBar = inject(MatSnackBar);

// buyNowItem: any = null;

// checkoutForm = new FormGroup({
//   fullName: new FormControl('', Validators.required),
//   email: new FormControl('', [Validators.required, Validators.email]),
//   phone: new FormControl('', Validators.required),
//   address: new FormControl('', Validators.required),
//   landmark: new FormControl('', Validators.required),
//   city: new FormControl('', Validators.required),
//   state: new FormControl('', Validators.required),
//   pinCode: new FormControl('', Validators.required),
//   shippingMethod: new FormControl('free'),
// });

// submitForm() {
//   console.log(this.checkoutForm.value);
// }

// ngOnInit() {
//   const item = localStorage.getItem('buyNowItem');
//   if (item) {
//     this.buyNowItem = JSON.parse(item);
//   }

//   if (this.cartService.cart().length === 0 && !this.buyNowItem) {
//     this.router.navigate(['/']);
//     return;
//   }

//   const user = this.authService.getUser();
//   if (user) {
//     this.checkoutForm.patchValue({
//       fullName: user.firstName + ' ' + user.lastName,
//       email: user.email,
//       phone: user.phoneNumber?.[0] || '',
//     });
//   }
//   console.log('BUY NOW ITEM:', this.buyNowItem);
// }

// shippingPrice() {
//   return this.checkoutForm.value.shippingMethod === 'express' ? 110 : 20;
// }

// getSubtotal() {
//   let total = this.cartService.totalPrice();

//   if (this.buyNowItem) {
//     total += this.buyNowItem.price * (this.buyNowItem.quantity || 1);
//   }

//   return total;
// }

// gst() {
//   return this.getSubtotal() * 0.18;
// }

// totalPrice() {
//   return this.getSubtotal() + this.gst() + this.shippingPrice();
// }

// submitOrder() {
//   if (this.checkoutForm.invalid) {
//     this.checkoutForm.markAllAsTouched();
//     return;
//   }
//   const items = [...this.cartService.cart(), ...(this.buyNowItem ? [this.buyNowItem] : [])];

//   const order = {
//     id: Date.now(),
//     address: this.checkoutForm.value,
//     items: items,
//     subtotal: this.getSubtotal(),
//     gst: this.gst(),
//     total: this.totalPrice(),
//     date: new Date(),
//     status: 'Placed',
//   };

//   const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
//   existingOrders.push(order);

//   localStorage.setItem('orders', JSON.stringify(existingOrders));
//   localStorage.setItem('latestOrder', JSON.stringify(order));

//   this.buyNowItem = null;
//   localStorage.removeItem('buyNowItem');
//   this.cartService.clearCart();
//   this.checkoutForm.reset();

//   this.snackBar.open('Order placed successfully!', 'Close', {
//     duration: 2000,
//     horizontalPosition: 'center',
//     verticalPosition: 'top',
//     panelClass: ['snackbar-success'],
//   });

//   this.router.navigate(['/order-success', order.id]);
// }

////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////
// getSubtotal() {
//   let total = 0;

//   const cartTotal = this.cartService.totalPrice();
//   total += cartTotal;

//   if (this.buyNowItem) {
//     total += this.buyNowItem.price * (this.buyNowItem.quantity || 1);
//   }

//   return total;
// }

// gst() {
//   return this.cartService.totalPrice() * 0.18;
// }

// grandTotal() {
//   return this.cartService.totalPrice() + this.gst() + this.shippingPrice();
// }

// items: this.buyNowItem ? [this.buyNowItem] : this.cartService.cart(),
// items: this.cartService.cart(),
// subtotal: this.cartService.totalPrice(),

// shippingPrice() {
//   return this.checkoutForm.value.shippingMethod === 'express' ? 110 : 20;
// }

// shippingPrice() {
//   const baseShipping = 20;
//   const expressCharge = 90;

//   return this.checkoutForm.value.shippingMethod === 'express'
//     ? baseShipping + expressCharge
//     : baseShipping;
// }
