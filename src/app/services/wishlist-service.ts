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

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  private wishlist = signal<Product[]>([]);

  itemCount = computed(() => this.wishlist().length);

  getWishlist = this.wishlist.asReadonly();

  constructor() {
    authState(this.auth).subscribe((user) => {
      if (user) {
        this.loadWishlist();
      } else {
        this.wishlist.set([]);
      }
    });
  }

  // constructor() {
  //   this.auth.onAuthStateChanged((user) => {
  //     if (user) {
  //       this.loadWishlist();
  //     } else {
  //       this.wishlist.set([]);
  //     }
  //   });
  // }

  loadWishlist() {
    const uid = this.auth.currentUser?.uid;

    if (!uid) return;

    const wishlistRef = collection(this.firestore, `users/${uid}/wishlist`);

    collectionData(wishlistRef).subscribe((items: any) => {
      this.wishlist.set(items);
    });
  }

  async addToWishlist(product: Product) {
    const uid = this.auth.currentUser?.uid;

    if (!uid) return;

    if (!this.wishlist().find((p) => p.id === product.id)) {
      this.wishlist.update((items) => [...items, product]);

      await setDoc(doc(this.firestore, `users/${uid}/wishlist/${product.id}`), product);
    }
  }

  async removeFromWishlist(id: string) {
    const uid = this.auth.currentUser?.uid;

    if (!uid) return;

    this.wishlist.update((items) => items.filter((p) => p.id !== id));

    await deleteDoc(doc(this.firestore, `users/${uid}/wishlist/${id}`));
  }

  isInWishlist(id: string): boolean {
    return this.wishlist().some((p) => p.id === id);
  }
}

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// JSON VERSION ////////////////////////////////

// import { computed, Injectable, signal } from '@angular/core';
// import { Product } from '../models/products';

// @Injectable({
//   providedIn: 'root',
// })
// export class WishlistService {
//   private wishlist = signal<Product[]>(this.loadWishlist());

//   itemCount = computed(() => this.wishlist().length);

//   getWishlist = this.wishlist.asReadonly();
//   // getWishlist() {
//   //   return this.wishlist();
//   // }

//   addToWishlist(product: Product) {
//     if (!this.wishlist().find((p) => p.id === product.id)) {
//       this.wishlist.update((items) => {
//         const updated = [...items, product];
//         this.save(updated);
//         return updated;
//       });
//     }
//   }

//   removeFromWishlist(id: string) {
//     this.wishlist.update((items) => {
//       const updated = items.filter((p) => p.id !== id);
//       this.save(updated);
//       return updated;
//     });
//   }

//   isInWishlist(id: string): boolean {
//     return this.wishlist().some((p) => p.id === id);
//   }

//   private save(data: Product[]) {
//     localStorage.setItem('wishlist', JSON.stringify(data));
//   }

//   private loadWishlist(): Product[] {
//     const stored = localStorage.getItem('wishlist');
//     return stored ? JSON.parse(stored) : [];
//   }
// }

// clearWishlist() {
//   this.wishlist.set([]);
//   localStorage.removeItem('wishlist');
// }
