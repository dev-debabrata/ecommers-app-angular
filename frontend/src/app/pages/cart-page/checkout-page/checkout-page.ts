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

  buyNowItem: any = null;

  checkoutForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    zipCode: new FormControl('', Validators.required),
    description: new FormControl(''),
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

    const user = this.authService.getUser();

    if (user) {
      this.checkoutForm.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phoneNumber?.[0] || '',
      });
    }
  }

  shippingPrice() {
    const baseShipping = 20;
    const expressCharge = 90;

    return this.checkoutForm.value.shippingMethod === 'express'
      ? baseShipping + expressCharge
      : baseShipping;
  }

  // shippingPrice() {
  //   return this.checkoutForm.value.shippingMethod === 'express' ? 110 : 20;
  // }

  gst() {
    return this.cartService.totalPrice() * 0.18;
  }

  grandTotal() {
    return this.cartService.totalPrice() + this.gst() + this.shippingPrice();
  }

  placeOrder() {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    const order = {
      id: Date.now(),
      address: this.checkoutForm.value,
      items: this.cartService.cart(),
      subtotal: this.cartService.totalPrice(),
      gst: this.gst(),
      total: this.grandTotal(),
      date: new Date(),
      status: 'Placed',
    };

    // const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    // existingOrders.push(order);
    // localStorage.setItem('orders', JSON.stringify(existingOrders));

    localStorage.setItem('orders', JSON.stringify(order));

    this.cartService.clearCart();
    this.checkoutForm.reset();

    alert('Order placed successfully!');
  }
}

//////////////////////////////////////////////////////////
// placeOrder() {
//   if (this.addressForm.invalid) {
//     this.addressForm.markAllAsTouched();
//     console.log('BUTTON CLICKED');
//     return;
//   }

//   const order = {
//     id: Date.now(),
//     address: this.addressForm.value,
//     items: this.cartService.cart(),
//     subtotal: this.cartService.totalPrice(),
//     gst: this.gst(),
//     total: this.grandTotal(),
//     date: new Date(),
//     status: 'Placed',
//   };

//   // const orders = JSON.parse(localStorage.getItem('orders') || '[]');
//   // orders.push(order);
//   localStorage.setItem('orders', JSON.stringify(order));

//   this.cartService.clearCart();

//   alert('Order placed successfully!');
//   this.addressForm.reset();
// }
