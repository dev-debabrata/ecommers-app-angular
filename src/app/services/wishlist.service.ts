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
import { from, Observable, of } from 'rxjs';

import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private wishlistSub: any = null;
  private wishlist = signal<Product[]>([]);

  itemCount = computed(() => this.wishlist().length);

  getWishlistSignal = this.wishlist.asReadonly();

  constructor() {
    authState(this.auth).subscribe((user) => {
      if (user) {
        this.loadWishlist();
      } else {
        this.wishlist.set([]);
      }
    });
  }

  loadWishlist() {
    const uid = this.auth.currentUser?.uid;
    if (!uid) return;

    if (this.wishlistSub) {
      this.wishlistSub.unsubscribe();
    }

    const wishlistRef = collection(this.firestore, `users/${uid}/wishlist`);

    collectionData(wishlistRef, { idField: 'id' }).subscribe((items: any[]) => {
      const sorted = (items || []).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

      this.wishlist.set(sorted);
    });
  }

  addToWishlist(product: Product): Observable<void> {
    const uid = this.auth.currentUser?.uid;
    if (!uid) return of(void 0);

    const exists = this.isInWishlist(product.id);
    if (exists) return of(void 0);

    const item = {
      ...product,
      createdAt: Date.now(),
    };

    this.wishlist.update((items) => [item, ...items]);

    return from(setDoc(doc(this.firestore, `users/${uid}/wishlist/${product.id}`), item));
  }

  removeFromWishlist(id: string): void {
    const uid = this.auth.currentUser?.uid;
    if (!uid) return;

    this.wishlist.update((items) => items.filter((p) => p.id !== id));

    deleteDoc(doc(this.firestore, `users/${uid}/wishlist/${id}`)).catch((err) => {
      console.error('Delete failed:', err);
    });
  }

  isInWishlist(id: string | undefined): boolean {
    if (!id) return false;
    return this.wishlist().some((p) => p.id === id);
  }
}

//////////////////////////////////////////////////////////////////////////////

// getWishlist(): Observable<Product[]> {
//   const uid = this.auth.currentUser?.uid;

//   if (!uid) {
//     this.wishlist.set([]);
//     return of([]);
//   }

//   const wishlistRef = collection(this.firestore, `users/${uid}/wishlist`);

//   return collectionData(wishlistRef, { idField: 'id' }).pipe(
//     map((items: any[]) => {
//       const sorted = (items || []).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

//       this.wishlist.set(sorted);

//       return sorted;
//     }),
//   );
// }

// getWishlist() {
//   const uid = this.auth.currentUser?.uid;
//   if (!uid) return;

//   const wishlistRef = collection(this.firestore, `users/${uid}/wishlist`);

//   collectionData(wishlistRef, { idField: 'id' }).subscribe((items: any) => {
//     const sorted = (items || []).sort(
//       (a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0),
//     );

//     this.wishlist.set(sorted);
//   });
// }

// addToWishlist(product: Product) {
//   const uid = this.auth.currentUser?.uid;
//   if (!uid) return;

//   const item = {
//     ...product,
//     createdAt: Date.now(),
//   };

//   const exists = this.wishlist().find((p) => p.id === product.id);
//   if (exists) return;

//   this.wishlist.update((items) => [item, ...items]);

//   return from(setDoc(doc(this.firestore, `users/${uid}/wishlist/${product.id}`), item));
// }

// removeFromWishlist(id: string): Observable<void> {
//   const uid = this.auth.currentUser?.uid;

//   if (!uid) return from(Promise.resolve());

//   this.wishlist.update((items) => items.filter((p) => p.id !== id));

//   return from(deleteDoc(doc(this.firestore, `users/${uid}/wishlist/${id}`)));
// }

// async removeFromWishlist(id: string) {
//   const uid = this.auth.currentUser?.uid;

//   if (!uid) return;

//   this.wishlist.update((items) => items.filter((p) => p.id !== id));

//   await deleteDoc(doc(this.firestore, `users/${uid}/wishlist/${id}`));
// }

///////////////////////////////////////////////////////////////////////////////

// constructor() {
//   this.auth.onAuthStateChanged((user) => {
//     if (user) {
//       this.loadWishlist();
//     } else {
//       this.wishlist.set([]);
//     }
//   });
// }

// loadWishlist() {
//   const uid = this.auth.currentUser?.uid;

//   if (!uid) return;

//   const wishlistRef = collection(this.firestore, `users/${uid}/wishlist`);

//   collectionData(wishlistRef).subscribe((items: any) => {
//     this.wishlist.set(items);
//   });
// }

// async addToWishlist(product: Product) {
//   const uid = this.auth.currentUser?.uid;

//   if (!uid) return;

//   if (!this.wishlist().find((p) => p.id === product.id)) {
//     this.wishlist.update((items) => [...items, product]);

//     await setDoc(doc(this.firestore, `users/${uid}/wishlist/${product.id}`), product);
//   }
// }

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
