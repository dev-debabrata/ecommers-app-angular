import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Product } from '../models/products';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'https://dummyjson.com/products';
  private http = inject(HttpClient);

  private productsCache: Product[] = [];

  getProducts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?limit=30`);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  setProductsCache(products: Product[]) {
    this.productsCache = products;
  }

  getProductsCache(): Product[] {
    return this.productsCache;
  }
}
