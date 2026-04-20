import { Component, inject, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './checkout-page.html',
  styleUrl: './checkout-page.css',
})
export class CheckoutPage implements OnInit {
  public cartService = inject(CartService);
  private authService = inject(AuthService);
  private router = inject(Router);

  private snackBar = inject(MatSnackBar);

  buyNowItem: any = null;

  checkoutForm = new FormGroup({
    fullName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    landmark: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    pinCode: new FormControl('', Validators.required),
    shippingMethod: new FormControl('free'),
  });

  submitForm() {
    console.log(this.checkoutForm.value);
  }

  ngOnInit() {
    const item = localStorage.getItem('buyNowItem');
    if (item) {
      this.buyNowItem = JSON.parse(item);
    }

    if (this.cartService.cart().length === 0 && !this.buyNowItem) {
      this.router.navigate(['/']);
      return;
    }

    const user = this.authService.getUser();
    if (user) {
      this.checkoutForm.patchValue({
        fullName: user.firstName + ' ' + user.lastName,
        email: user.email,
        phone: user.phoneNumber?.[0] || '',
      });
    }
    console.log('BUY NOW ITEM:', this.buyNowItem);
  }

  shippingPrice() {
    return this.checkoutForm.value.shippingMethod === 'express' ? 110 : 20;
  }

  getSubtotal() {
    let total = this.cartService.totalPrice();

    if (this.buyNowItem) {
      total += this.buyNowItem.price * (this.buyNowItem.quantity || 1);
    }

    return total;
  }

  gst() {
    return this.getSubtotal() * 0.18;
  }

  totalPrice() {
    return this.getSubtotal() + this.gst() + this.shippingPrice();
  }

  placeOrder() {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }
    const items = [...this.cartService.cart(), ...(this.buyNowItem ? [this.buyNowItem] : [])];

    const order = {
      id: Date.now(),
      address: this.checkoutForm.value,
      items: items,
      subtotal: this.getSubtotal(),
      gst: this.gst(),
      total: this.totalPrice(),
      date: new Date(),
      status: 'Placed',
    };

    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    existingOrders.push(order);
    localStorage.setItem('orders', JSON.stringify(existingOrders));

    localStorage.setItem('latestOrder', JSON.stringify(order));

    this.buyNowItem = null;
    localStorage.removeItem('buyNowItem');
    this.cartService.clearCart();
    this.checkoutForm.reset();

    this.snackBar.open('Order placed successfully!', 'Close', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['snackbar-success'],
    });

    this.router.navigate(['/order-success', order.id]);
  }
}

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
