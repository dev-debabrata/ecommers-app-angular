import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private wishlist = signal<any[]>(this.loadWishlist());

  itemCount = computed(() => this.wishlist().length);

  getWishlist = this.wishlist.asReadonly();
  // getWishlist() {
  //   return this.wishlist();
  // }

  addToWishlist(product: any) {
    if (!this.wishlist().find((p) => p.id === product.id)) {
      this.wishlist.update((items) => {
        const updated = [...items, product];
        this.save(updated);
        return updated;
      });
    }
  }

  removeFromWishlist(id: number) {
    this.wishlist.update((items) => {
      const updated = items.filter((p) => p.id !== id);
      this.save(updated);
      return updated;
    });
  }

  isInWishlist(id: number): boolean {
    return this.wishlist().some((p) => p.id === id);
  }

  // clearWishlist() {
  //   this.wishlist.set([]);
  //   localStorage.removeItem('wishlist');
  // }

  private save(data: any[]) {
    localStorage.setItem('wishlist', JSON.stringify(data));
  }

  private loadWishlist(): any[] {
    const stored = localStorage.getItem('wishlist');
    return stored ? JSON.parse(stored) : [];
  }
}
