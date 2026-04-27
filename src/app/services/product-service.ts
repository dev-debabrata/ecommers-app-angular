import { inject, Injectable } from '@angular/core';

import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
} from '@angular/fire/firestore';

import { Observable } from 'rxjs';

import { Product } from '../models/products';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private firestore = inject(Firestore);

  private productsRef = collection(this.firestore, 'products');

  getProducts(): Observable<Product[]> {
    return collectionData(this.productsRef, {
      idField: 'id',
    }) as Observable<Product[]>;
  }

  async getProductById(id: string) {
    const productRef = doc(this.firestore, 'products/' + id);
    const snap = await getDoc(productRef);

    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  }

  // async getProductById(id: string) {
  //   const productRef = doc(this.firestore, 'products/' + id);
  //   const snap = await getDoc(productRef);

  //   return snap.exists() ? snap.data() : null;
  // }

  addProduct(product: Product) {
    return addDoc(this.productsRef, {
      ...product,
      createdAt: Date.now(),
    });
  }

  // addProduct(product: Product) {
  //   return addDoc(this.productsRef, product);
  // }

  deleteProduct(id: string) {
    const productRef = doc(this.firestore, 'products/' + id);
    return deleteDoc(productRef);
  }

  updateProduct(id: string, data: Partial<Product>) {
    const productRef = doc(this.firestore, 'products/' + id);
    return updateDoc(productRef, data);
  }
}

// import { HttpClient } from '@angular/common/http';
// import { inject, Injectable } from '@angular/core';
// import { Observable } from 'rxjs';

// import { Product } from '../models/products';

// @Injectable({
//   providedIn: 'root',
// })
// export class ProductService {
//   private apiUrl = 'https://dummyjson.com/products';
//   private http = inject(HttpClient);

//   private productsCache: Product[] = [];

//   getProducts(): Observable<any> {
//     return this.http.get<any>(`${this.apiUrl}?limit=30`);
//   }

//   getProductById(id: number): Observable<Product> {
//     return this.http.get<Product>(`${this.apiUrl}/${id}`);
//   }

//   setProductsCache(products: Product[]) {
//     this.productsCache = products;
//   }

//   getProductsCache(): Product[] {
//     return this.productsCache;
//   }
// }
