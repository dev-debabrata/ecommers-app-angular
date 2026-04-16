import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/users';
  private http = inject(HttpClient);

  signupUser(data: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, data);
  }

  checkEmail(email: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${email}`);
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  removeToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  setUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUserName(): string {
    const user = localStorage.getItem('user');
    if (!user) return '';

    const parsed = JSON.parse(user);

    return `${parsed.firstName} ${parsed.lastName}`;
  }

  getUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}

///////////////////////////////////////////////////
//   getUser(): User | null {
//   const user = localStorage.getItem('user');
//   if (!user) return null;

//   try {
//     return JSON.parse(user);
//   } catch {
//     return null;
//   }
// }
