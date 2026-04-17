import { Component, inject } from '@angular/core';
import { CartService } from '../../services/cart-service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './checkout-page.html',
  styleUrl: './checkout-page.css',
})
export class CheckoutPage {
  public cartService = inject(CartService);

  private fb = inject(FormBuilder);

  buyNowItem: any = null;

  addressForm = this.fb.group({
    name: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    pincode: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
  });

  ngOnInit() {
    const item = localStorage.getItem('buyNowItem');

    if (item) {
      this.buyNowItem = JSON.parse(item);
    }
  }

  gst() {
    return this.cartService.totalPrice() * 0.18;
  }

  grandTotal() {
    return this.cartService.totalPrice() + this.gst();
  }

  placeOrder() {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      console.log('BUTTON CLICKED');
      return;
    }

    const order = {
      id: Date.now(),
      address: this.addressForm.value,
      items: this.cartService.cart(),
      subtotal: this.cartService.totalPrice(),
      gst: this.gst(),
      total: this.grandTotal(),
      date: new Date(),
      status: 'Placed',
    };

    // const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    // orders.push(order);
    localStorage.setItem('orders', JSON.stringify(order));

    this.cartService.clearCart();

    alert('Order placed successfully!');
    this.addressForm.reset();
  }
}
