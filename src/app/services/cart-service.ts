import { computed, inject, Injectable, signal } from '@angular/core';

import {
  Firestore,
  collection,
  collectionData,
  doc,
  setDoc,
  deleteDoc,
} from '@angular/fire/firestore';

import { Auth, authState } from '@angular/fire/auth';

import { Product } from '../models/products';
import { CartItem } from '../models/cart-item';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  cart = signal<CartItem[]>([]);

  itemCount = computed(() => this.cart().length);

  getDiscountPrice(item: CartItem): number {
    if (!item.discount) return item.price;

    return item.price - (item.price * item.discount) / 100;
  }

  totalPrice = computed(() =>
    this.cart().reduce((acc, item) => acc + this.getDiscountPrice(item) * item.quantity, 0),
  );

  // totalPrice = computed(() =>
  //   this.cart().reduce((acc, item) => acc + item.price * item.quantity, 0),
  // );

  constructor() {
    authState(this.auth).subscribe((user) => {
      if (user) {
        this.loadCart();
      } else {
        this.cart.set([]);
      }
    });
  }

  // constructor() {
  //   this.auth.onAuthStateChanged((user) => {
  //     if (user) {
  //       this.loadCart();
  //     } else {
  //       this.cart.set([]);
  //     }
  //   });
  // }

  loadCart() {
    const uid = this.auth.currentUser?.uid;

    if (!uid) return;

    const cartRef = collection(this.firestore, `users/${uid}/cart`);

    collectionData(cartRef).subscribe((items: any) => {
      const updated = items.map((item: any) => ({
        ...item,
        quantity: item.quantity ?? 1,
        discount: item.discount ?? 0,
      }));

      this.cart.set(updated);
      //  const current = this.cart();
      // if (JSON.stringify(current) !== JSON.stringify(updated)) {

      // }
    });
  }

  // loadCart() {
  //   const uid = this.auth.currentUser?.uid;

  //   if (!uid) return;

  //   const cartRef = collection(this.firestore, `users/${uid}/cart`);

  //   collectionData(cartRef).subscribe((items: any) => {
  //     this.cart.set(
  //       items.map((item: any) => ({
  //         ...item,
  //         quantity: item.quantity ?? 1,
  //         discount: item.discount ?? 0,
  //       })),
  //     );
  //   });
  // }

  async addToCart(product: Product) {
    const uid = this.auth.currentUser?.uid;
    if (!uid) return;

    const existing = this.cart().find((i) => i.id === product.id);

    if (existing) {
      const updatedItem = {
        ...existing,
        quantity: existing.quantity + 1,

        price: product.price,
        name: product.title,
        discount: product.discount || 0,
        image: product.image,
        category: product.category,
        stock: product.stock,
      };

      this.cart.update((items) => items.map((i) => (i.id === product.id ? updatedItem : i)));

      await setDoc(doc(this.firestore, `users/${uid}/cart/${product.id}`), updatedItem);

      return;
    }

    const cartItem: CartItem = {
      id: product.id!,
      name: product.title,
      price: product.price,
      discount: product.discount || 0,
      image: product.image,
      category: product.category,
      brand: product.brand,
      stock: product.stock,
      quantity: 1,
    };

    this.cart.update((items) => [...items, cartItem]);

    await setDoc(doc(this.firestore, `users/${uid}/cart/${product.id}`), cartItem);
  }

  // async addToCart(product: Product) {
  //   const uid = this.auth.currentUser?.uid;

  //   if (!uid) return;

  //   const existing = this.cart().find((i) => i.id === product.id);

  //   const cartItem: CartItem = {
  //     id: product.id!,
  //     name: product.title,
  //     price: product.price,
  //     discount: product.discount || 0,
  //     image: product.image,
  //     category: product.category,
  //     stock: product.stock,
  //     brand: product.brand,
  //     quantity: existing ? existing.quantity + 1 : 1,
  //   };

  //   this.cart.update((items) => {
  //     if (existing) {
  //       return items.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
  //     }

  //     return [...items, cartItem];
  //   });

  //   await setDoc(doc(this.firestore, `users/${uid}/cart/${product.id}`), cartItem);
  // }

  async removeItem(id: string) {
    const uid = this.auth.currentUser?.uid;

    if (!uid) return;

    this.cart.update((items) => items.filter((i) => i.id !== id));

    await deleteDoc(doc(this.firestore, `users/${uid}/cart/${id}`));
  }

  async updateQuantity(id: string, qty: number) {
    const uid = this.auth.currentUser?.uid;

    if (!uid) return;

    if (qty <= 0) {
      await this.removeItem(id);
      return;
    }

    const item = this.cart().find((i) => i.id === id);

    if (!item) return;

    this.cart.update((items) => items.map((i) => (i.id === id ? { ...i, quantity: qty } : i)));

    await setDoc(doc(this.firestore, `users/${uid}/cart/${id}`), {
      ...item,
      quantity: qty,
    });
  }

  async clearCart() {
    const uid = this.auth.currentUser?.uid;

    if (!uid) return;

    for (const item of this.cart()) {
      await deleteDoc(doc(this.firestore, `users/${uid}/cart/${item.id}`));
    }

    this.cart.set([]);
  }
}

//////////////////////////////////////////////////////////////////////////////

// import { computed, inject, Injectable, signal } from '@angular/core';

// import {
//   Firestore,
//   collection,
//   collectionData,
//   doc,
//   setDoc,
//   deleteDoc,
// } from '@angular/fire/firestore';

// import { Auth } from '@angular/fire/auth';

// import { Product } from '../models/products';
// import { CartItem } from '../models/cart-item';

// @Injectable({
//   providedIn: 'root',
// })
// export class CartService {
//   private firestore = inject(Firestore);
//   private auth = inject(Auth);

//   cart = signal<CartItem[]>([]);

//   itemCount = computed(() => this.cart().length);

//   totalPrice = computed(() =>
//     this.cart().reduce((acc, item) => acc + item.price * item.quantity, 0),
//   );

//   constructor() {
//     this.loadCart();
//   }

//   loadCart() {
//     const uid = this.auth.currentUser?.uid;

//     if (!uid) return;

//     const cartRef = collection(this.firestore, `users/${uid}/cart`);

//     collectionData(cartRef).subscribe((items: any) => {
//       this.cart.set(
//         items.map((item: any) => ({
//           ...item,
//           quantity: item.quantity ?? 1,
//           discount: item.discount ?? 0,
//         })),
//       );
//     });
//   }

//   async addToCart(product: Product) {
//     const uid = this.auth.currentUser?.uid;

//     if (!uid) return;

//     const existing = this.cart().find((i) => i.id === product.id);

//     const cartItem: CartItem = {
//       id: product.id!,
//       name: product.title,
//       price: product.price,
//       discount: product.discount || 0,
//       image: product.image,
//       category: product.category,
//       stock: product.stock,
//       quantity: existing ? existing.quantity + 1 : 1,
//     };

//     await setDoc(doc(this.firestore, `users/${uid}/cart/${product.id}`), cartItem);
//   }

//   async removeItem(id: string) {
//     const uid = this.auth.currentUser?.uid;

//     if (!uid) return;

//     await deleteDoc(doc(this.firestore, `users/${uid}/cart/${id}`));
//   }

//   async updateQuantity(id: string, qty: number) {
//     const uid = this.auth.currentUser?.uid;

//     if (!uid) return;

//     if (qty <= 0) {
//       await this.removeItem(id);
//       return;
//     }

//     const item = this.cart().find((i) => i.id === id);

//     if (!item) return;

//     await setDoc(doc(this.firestore, `users/${uid}/cart/${id}`), {
//       ...item,
//       quantity: qty,
//     });
//   }

//   async clearCart() {
//     const uid = this.auth.currentUser?.uid;

//     if (!uid) return;

//     for (const item of this.cart()) {
//       await deleteDoc(doc(this.firestore, `users/${uid}/cart/${item.id}`));
//     }

//     this.cart.set([]);
//   }
// }

// import { computed, effect, Injectable, signal } from '@angular/core';

// import { Product } from '../models/products';
// import { CartItem } from '../models/cart-item';

// @Injectable({
//   providedIn: 'root',
// })
// export class CartService {
//   cart = signal<CartItem[]>(this.loadCart());

//   itemCount = computed(() => this.cart().length);

//   totalPrice = computed(() =>
//     this.cart().reduce((acc, item) => acc + item.price * item.quantity, 0),
//   );

//   constructor() {
//     effect(() => {
//       localStorage.setItem('cart', JSON.stringify(this.cart()));
//     });
//   }

//   private loadCart(): CartItem[] {
//     const data = localStorage.getItem('cart');

//     return data
//       ? JSON.parse(data).map((item: any) => ({
//           ...item,
//           quantity: item.quantity ?? 1,
//           discount: item.discount ?? 0,
//         }))
//       : [];
//   }

//   addToCart(product: Product) {
//     this.cart.update((items) => {
//       const existing = items.find((i) => i.id === product.id);

//       if (existing) {
//         return items.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
//       }

//       const cartProduct: CartItem = {
//         id: product.id!,
//         name: product.title,
//         price: product.price,
//         discount: product.discount || 0,
//         image: product.image,
//         category: product.category,
//         stock: product.stock,
//         quantity: 1,
//       };

//       return [...items, cartProduct];
//     });
//   }

//   removeItem(id: string) {
//     this.cart.update((items) => items.filter((i) => i.id !== id));
//   }

//   updateQuantity(id: string, qty: number) {
//     if (qty <= 0) {
//       this.removeItem(id);
//       return;
//     }

//     this.cart.update((items) => items.map((i) => (i.id === id ? { ...i, quantity: qty } : i)));
//   }

//   clearCart() {
//     this.cart.set([]);
//   }
// }

///////////////////////////////////////////////////////////////////////

// import { computed, effect, Injectable, signal } from '@angular/core';

// import { Product } from '../models/products';
// import { CartItem } from '../models/cart-item';

// @Injectable({
//   providedIn: 'root',
// })
// export class CartService {
//   cart = signal<CartItem[]>(this.loadCart());

//   itemCount = computed(() => this.cart().length);

//   totalPrice = computed(() =>
//     this.cart().reduce((acc, item) => acc + item.price * item.quantity, 0),
//   );

//   constructor() {
//     effect(() => {
//       localStorage.setItem('cart', JSON.stringify(this.cart()));
//     });
//   }

//   private loadCart(): CartItem[] {
//     const data = localStorage.getItem('cart');
//     return data
//       ? JSON.parse(data).map((item: any) => ({
//           ...item,
//           quantity: item.quantity ?? 1,
//           discountPercentage: item.discountPercentage ?? 0,
//         }))
//       : [];
//   }

//   addToCart(product: Product) {
//     this.cart.update((items) => {
//       const existing = items.find((i) => i.id === product.id);

//       if (existing) {
//         return items.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
//       }

//       const cartProduct: CartItem = {
//         id: product.id,
//         name: product.title,
//         price: product.price,
//         discountPercentage: product.discountPercentage,
//         image: product.thumbnail,
//         category: product.category,
//         stock: product.stock,
//         quantity: 1,
//       };

//       return [...items, cartProduct];
//     });
//   }

//   removeItem(id: number) {
//     this.cart.update((items) => items.filter((i) => i.id !== id));
//   }

//   updateQuantity(id: number, qty: number) {
//     if (qty <= 0) {
//       this.removeItem(id);
//       return;
//     }

//     this.cart.update((items) => items.map((i) => (i.id === id ? { ...i, quantity: qty } : i)));
//   }

//   clearCart() {
//     this.cart.set([]);
//     // localStorage.removeItem('cart');
//   }
// }

// itemCount = computed(() => this.cart().reduce((acc, item) => acc + (item.quantity || 0), 0));

// itemCount = computed(() => this.cart().reduce((acc, item) => acc + item.quantity, 0));

// private loadCart(): CartItem[] {
//   const data = localStorage.getItem('cart');
//   return data ? JSON.parse(data) : [];
// }
