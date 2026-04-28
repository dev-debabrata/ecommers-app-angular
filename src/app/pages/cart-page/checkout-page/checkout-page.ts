import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { CartService } from '../../../services/cart-service';
import { AuthService } from '../../../services/auth-service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TruncatePipe } from '../../../pipes/truncate-pipe';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, TruncatePipe],
  templateUrl: './checkout-page.html',
  styleUrl: './checkout-page.css',
})
export class CheckoutPage implements OnInit {
  public cartService = inject(CartService);
  private authService = inject(AuthService);
  private router = inject(Router);

  private snackBar = inject(MatSnackBar);

  buyNowItem: any = null;
  submitted = signal(false);
  touchedFields = signal<Record<string, boolean>>({});

  checkoutForm = signal({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    landmark: '',
    city: '',
    state: '',
    pinCode: '',
    shippingMethod: 'free',
  });

  markTouched(field: string) {
    this.touchedFields.update((touch) => ({
      ...touch,
      [field]: true,
    }));
  }

  updateField(field: string, value: string) {
    this.checkoutForm.update((form) => ({ ...form, [field]: value }));
  }

  isInvalid(field: keyof ReturnType<typeof this.checkoutForm>) {
    return (this.submitted() || this.touchedFields()[field]) && !this.checkoutForm()[field];
  }

  async ngOnInit(): Promise<void> {
    const item = localStorage.getItem('buyNowItem');

    if (item) {
      this.buyNowItem = JSON.parse(item);
    }

    if (this.cartService.cart().length === 0 && !this.buyNowItem) {
      this.router.navigate(['/']);
      return;
    }

    const user: any = await this.authService.getFullUser();

    if (user) {
      this.checkoutForm.update((form) => ({
        ...form,
        fullName: user.firstName + ' ' + user.lastName,
        email: user.email,
        phone: user.phoneNumber || '',
      }));
    }
  }

  // ngOnInit(): void {
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
  //     this.checkoutForm.update((form) => ({
  //       ...form,
  //       fullName: user.firstName + ' ' + user.lastName,
  //       email: user.email,
  //       phone: user.phoneNumber?.[0] || '',
  //     }));
  //   }
  // }

  shippingPrice = computed(() => (this.checkoutForm().shippingMethod === 'express' ? 110 : 20));

  subTotal = computed(() => {
    let total = this.cartService.totalPrice();

    if (this.buyNowItem) {
      total += this.buyNowItem.price * (this.buyNowItem.quantity || 1);
    }
    return total;
  });

  gst = computed(() => this.subTotal() * 0.18);

  totalPrice = computed(() => this.subTotal() + this.gst() + this.shippingPrice());

  isFormValid() {
    const form = this.checkoutForm();
    return (
      form.fullName &&
      form.email &&
      form.phone &&
      form.address &&
      form.landmark &&
      form.city &&
      form.state &&
      form.pinCode
    );
  }

  async submitOrder() {
    this.submitted.set(true);

    if (!this.isFormValid()) {
      this.snackBar.open('Please fill all required fields correctly!', 'Close', {
        duration: 2500,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['snackbar-error'],
      });

      document.querySelector('.checkout-left')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    const user: any = await this.authService.getFullUser();
    if (!user?.uid) {
      this.snackBar.open('User not logged in!', 'Close', { duration: 2000 });
      return;
    }

    const items = [...this.cartService.cart(), ...(this.buyNowItem ? [this.buyNowItem] : [])];

    const order = {
      address: this.checkoutForm(),
      items,
      subTotal: this.subTotal(),
      gst: this.gst(),
      total: this.totalPrice(),
      date: new Date(),
      status: 'placed',
    };

    try {
      const docRef = await this.orderService.createOrder(user.uid, order);

      this.buyNowItem = null;
      localStorage.removeItem('buyNowItem');
      this.cartService.clearCart();

      this.checkoutForm.set({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        landmark: '',
        city: '',
        state: '',
        pinCode: '',
        shippingMethod: 'free',
      });

      this.submitted.set(false);
      this.touchedFields.set({});

      this.snackBar.open('Order placed successfully!', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['snackbar-success'],
      });

      this.router.navigate(['/order-success', docRef.id]);
    } catch (error) {
      console.error(error);
      this.snackBar.open('Failed to place order!', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['snackbar-error'],
      });
    }
  }

  // submitOrder() {
  //   this.submitted.set(true);

  //   if (!this.isFormValid()) {
  //     this.snackBar.open('Please fill all required fields correctly!', 'Close', {
  //       duration: 3000,
  //       horizontalPosition: 'center',
  //       verticalPosition: 'top',
  //       panelClass: ['snackbar-error'],
  //     });

  //     document.querySelector('.checkout-left')?.scrollIntoView({ behavior: 'smooth' });
  //     return;
  //   }

  //   const items = [...this.cartService.cart(), ...(this.buyNowItem ? [this.buyNowItem] : [])];

  //   const order = {
  //     id: Date.now(),
  //     address: this.checkoutForm(),
  //     items,
  //     subTotal: this.subTotal(),
  //     gst: this.gst(),
  //     total: this.totalPrice(),
  //     date: new Date(),
  //     status: 'Places',
  //   };

  //   const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
  //   existingOrders.push(order);
  //   localStorage.setItem('orders', JSON.stringify(existingOrders));
  //   localStorage.setItem('latestOrder', JSON.stringify(order));

  //   this.buyNowItem = null;
  //   localStorage.removeItem('buyNowItem');
  //   this.cartService.clearCart();

  //   this.checkoutForm.set({
  //     fullName: '',
  //     email: '',
  //     phone: '',
  //     address: '',
  //     landmark: '',
  //     city: '',
  //     state: '',
  //     pinCode: '',
  //     shippingMethod: 'free',
  //   });
  //   this.submitted.set(false);
  //   this.touchedFields.set({});

  //   this.snackBar.open('Order placed successfully!', 'Close', {
  //     duration: 2000,
  //     horizontalPosition: 'center',
  //     verticalPosition: 'top',
  //     panelClass: ['snackbar-success'],
  //   });

  //   this.router.navigate(['/order-success', order.id]);
  // }
}

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
