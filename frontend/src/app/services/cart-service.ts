import { computed, effect, Injectable, signal } from '@angular/core';
import { Product } from '../models/products';
import { CartItem } from '../models/cart-item';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cart = signal<CartItem[]>(this.loadCart());

  itemCount = computed(() => this.cart().length);

  totalPrice = computed(() =>
    this.cart().reduce((acc, item) => acc + item.price * item.quantity, 0),
  );

  constructor() {
    effect(() => {
      localStorage.setItem('cart', JSON.stringify(this.cart()));
    });
  }

  private loadCart(): CartItem[] {
    const data = localStorage.getItem('cart');
    return data
      ? JSON.parse(data).map((item: any) => ({
          ...item,
          quantity: item.quantity ?? 1,
          discountPercentage: item.discountPercentage ?? 0,
        }))
      : [];
  }

  // private loadCart(): CartItem[] {
  //   const data = localStorage.getItem('cart');
  //   return data ? JSON.parse(data) : [];
  // }

  addToCart(product: Product) {
    this.cart.update((items) => {
      const existing = items.find((i) => i.id === product.id);

      if (existing) {
        return items.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
      }

      const cartProduct: CartItem = {
        id: product.id,
        name: product.title,
        price: product.price,
        discountPercentage: product.discountPercentage,
        image: product.thumbnail,
        category: product.category,
        stock: product.stock,
        quantity: 1,
      };

      return [...items, cartProduct];
    });
  }

  removeItem(id: number) {
    this.cart.update((items) => items.filter((i) => i.id !== id));
  }

  updateQuantity(id: number, qty: number) {
    if (qty <= 0) {
      this.removeItem(id);
      return;
    }

    this.cart.update((items) => items.map((i) => (i.id === id ? { ...i, quantity: qty } : i)));
  }

  clearCart() {
    this.cart.set([]);
    localStorage.removeItem('cart');
  }
}
