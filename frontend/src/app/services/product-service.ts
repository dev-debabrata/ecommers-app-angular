import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product } from '../models/products';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private api = 'https://dummyjson.com/products';
  private http = inject(HttpClient);

  private productsCache: Product[] = [];

  getProducts(): Observable<Product> {
    return this.http.get<Product>(`${this.api}?limit=30`);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.api}/${id}`);
  }

  setProductsCache(products: Product[]) {
    this.productsCache = products;
  }

  getProductsCache(): Product[] {
    return this.productsCache;
  }
}
