import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Admin } from '../models/admin';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthService {
  private apiUrl = 'http://localhost:3000/admin';
  private http = inject(HttpClient);
  private router = inject(Router);

  loginAdmin(email: string, password: string): Observable<Admin[]> {
    return this.http.get<Admin[]>(`${this.apiUrl}?email=${email}&password=${password}`);
  }

  logout() {
    localStorage.removeItem('admin');
    this.router.navigate(['/admin/login']);
  }
}
