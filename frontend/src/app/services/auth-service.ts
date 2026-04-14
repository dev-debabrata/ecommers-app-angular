import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
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

  login(email: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${email}`);
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

  // getUserName(): string {
  //   const user = this.getUser();
  //   if (!user) return '';

  //   return `${user.firstName || ''} ${user.lastName || ''}`.trim();
  // }

  getUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  //   getUser(): User | null {
  //   const user = localStorage.getItem('user');
  //   if (!user) return null;

  //   try {
  //     return JSON.parse(user);
  //   } catch {
  //     return null;
  //   }
  // }
}

//////////////////////////////////////////////

// private apiUrl = 'http://localhost:3000/users';

// private http = inject(HttpClient);

// signupUser(data: any): Observable<any> {
//   return this.http.post(this.apiUrl, data);
// }

// loginUser(data: any): Observable<any> {
//   return this.http.get<any[]>(`${this.apiUrl}?email=${data.email}`).pipe(
//     map((users) => {
//       const user = users.find((u) => u.email === data.email && u.password === data.password);

//       if (!user) {
//         throw { error: { message: 'Invalid email or password' } };
//       }

//       return {
//         token: 'fake-token-' + user.id,
//         user,
//       };
//     }),
//   );
// }

// checkEmail(email: string) {
//   return this.http.get<any[]>(`${this.apiUrl}?email=${email}`);
// }

// // checkEmail(email: string): Observable<{ available: boolean }> {
// //   return this.http.get<any[]>(`${this.apiUrl}?email=${email}`).pipe(
// //     map((users) => ({
// //       available: users.length === 0,
// //     })),
// //   );
// // }

// setToken(token: string) {
//   localStorage.setItem('token', token);
// }

// removeToken() {
//   localStorage.removeItem('token');
// }

// isLoggedIn(): boolean {
//   return !!localStorage.getItem('token');
// }

////////////////////////////////////////////////////////////////////////////////////////////////////
// private apiUrl = 'http://localhost:3000/users';

// private http = inject(HttpClient);

// signupUser(data: any): Observable<any> {
//   return this.http.post(this.apiUrl, data);
// }

// loginUser(data: any): Observable<any> {
//   return this.http.get<any[]>(`${this.apiUrl}?email=${data.email}`).pipe(
//     map((users) => {
//       const user = users.find((u) => u.email === data.email && u.password === data.password);

//       if (!user) {
//         throw { error: { message: 'Invalid email or password' } };
//       }

//       return {
//         token: 'fake-token-' + user.id,
//         user,
//       };
//     }),
//   );
// }

// checkEmail(email: string): Observable<{ available: boolean }> {
//   return this.http.get<any[]>(`${this.apiUrl}?email=${email}`).pipe(
//     map((users) => ({
//       available: users.length === 0,
//     })),
//   );
// }

// setToken(token: string) {
//   localStorage.setItem('token', token);
// }

// removeToken() {
//   localStorage.removeItem('token');
// }

// isLoggedIn(): boolean {
//   return !!localStorage.getItem('token');
// }
