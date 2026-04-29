import { Injectable, inject, signal } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  authState,
  User as FirebaseUser,
  fetchSignInMethodsForEmail,
} from '@angular/fire/auth';

import { Firestore, doc, getDoc, serverTimestamp, setDoc } from '@angular/fire/firestore';

import { Observable } from 'rxjs';

import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  firebaseUser$: Observable<FirebaseUser | null> = authState(this.auth);

  isAuthReady = signal(false);

  constructor() {
    this.firebaseUser$.subscribe(() => {
      this.isAuthReady.set(true);
    });
  }

  async signupUser(data: User, password: string) {
    const result = await createUserWithEmailAndPassword(this.auth, data.email, password);

    const uid = result.user.uid;

    await updateProfile(result.user, {
      displayName: `${data.firstName} ${data.lastName}`,
    });

    await setDoc(doc(this.firestore, 'users/' + uid), {
      ...data,
      uid,
      role: 'user',
      createdAt: serverTimestamp(),
    });

    return result.user;
  }

  async login(email: string, password: string) {
    const res = await signInWithEmailAndPassword(this.auth, email, password);

    const uid = res.user.uid;

    const userRef = doc(this.firestore, 'users/' + uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      await signOut(this.auth);
      throw new Error('User not found');
    }

    const role = snap.data()?.['role'];

    if (role !== 'user') {
      await signOut(this.auth);
      throw new Error('Unauthorized');
    }

    return res.user;
  }

  // async login(email: string, password: string) {
  //   const res = await signInWithEmailAndPassword(this.auth, email, password);

  //   return res.user;
  // }

  async logout() {
    return await signOut(this.auth);
  }

  async getUserRole(uid: string): Promise<'user' | 'admin'> {
    const userRef = doc(this.firestore, 'users/' + uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) return 'user';

    return snap.data()?.['role'] || 'user';
  }

  isLoggedIn(): boolean {
    return this.isAuthReady() && !!this.auth.currentUser;
  }

  getUserName(): string {
    return this.auth.currentUser?.displayName || '';
  }

  getUser() {
    const user = this.auth.currentUser;

    if (!user) return null;

    const parts = (user.displayName || '').split(' ');
    const firstName = parts[0] || '';
    const lastName = parts.slice(1).join(' ');

    return {
      uid: user.uid,
      email: user.email || '',
      firstName,
      lastName,
      displayName: user.displayName || '',
      phoneNumber: user.phoneNumber || '',
    };
  }

  async getFullUser() {
    const user = this.auth.currentUser;

    if (!user) return null;

    const userRef = doc(this.firestore, 'users/' + user.uid);
    const snap = await getDoc(userRef);

    return snap.exists() ? snap.data() : null;
  }

  async checkEmail(email: string): Promise<boolean> {
    const methods = await fetchSignInMethodsForEmail(this.auth, email);
    return methods.length > 0;
  }
}

///////////////////////////////////////////////////////////////////////

// import { Injectable, inject } from '@angular/core';
// import {
//   Auth,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signOut,
//   updateProfile,
//   authState,
//   User as FirebaseUser,
//   fetchSignInMethodsForEmail,
// } from '@angular/fire/auth';

// import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';

// import { Observable } from 'rxjs';

// import { User } from '../models/user';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   private auth = inject(Auth);
//   private firestore = inject(Firestore);

//   firebaseUser$: Observable<FirebaseUser | null> = authState(this.auth);

//   async signupUser(data: User, password: string) {
//     const result = await createUserWithEmailAndPassword(this.auth, data.email, password);

//     const uid = result.user.uid;

//     await updateProfile(result.user, {
//       displayName: `${data.firstName} ${data.lastName}`,
//     });

//     await setDoc(doc(this.firestore, 'users/' + uid), {
//       ...data,
//       uid,
//       role: 'user',
//     });

//     return result.user;
//   }

//   async login(email: string, password: string) {
//     const res = await signInWithEmailAndPassword(this.auth, email, password);

//     return res.user;
//   }

//   async logout() {
//     return await signOut(this.auth);
//   }

//   async getUserRole(uid: string): Promise<'user' | 'admin'> {
//     const userRef = doc(this.firestore, 'users/' + uid);
//     const snap = await getDoc(userRef);

//     if (!snap.exists()) return 'user';

//     return snap.data()?.['role'] || 'user';
//   }

//   isLoggedIn(): boolean {
//     return !!this.auth.currentUser;
//   }

//   getUserName(): string {
//     return this.auth.currentUser?.displayName || '';
//   }

//   getUser() {
//     const user = this.auth.currentUser;

//     if (!user) return null;

//     const parts = (user.displayName || '').split(' ');
//     const firstName = parts[0] || '';
//     const lastName = parts.slice(1).join(' ');

//     return {
//       uid: user.uid,
//       email: user.email || '',
//       firstName,
//       lastName,
//       displayName: user.displayName || '',
//       phoneNumber: [],
//     };
//   }

//   async getFullUser() {
//     const user = this.auth.currentUser;

//     if (!user) return null;

//     const userRef = doc(this.firestore, 'users/' + user.uid);
//     const snap = await getDoc(userRef);

//     return snap.exists() ? snap.data() : null;
//   }
// }

// import { inject, Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// import { User } from '../models/user';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   private apiUrl = 'http://localhost:3000/users';
//   private http = inject(HttpClient);

//   signupUser(data: User): Observable<User> {
//     return this.http.post<User>(this.apiUrl, data);
//   }

//   checkEmail(email: string): Observable<User[]> {
//     return this.http.get<User[]>(`${this.apiUrl}?email=${email}`);
//   }

//   setToken(token: string) {
//     localStorage.setItem('token', token);
//   }

//   logout() {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//   }

//   removeToken() {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//   }

//   isLoggedIn(): boolean {
//     return !!localStorage.getItem('token');
//   }

//   setUser(user: User) {
//     localStorage.setItem('user', JSON.stringify(user));
//   }

//   getUserName(): string {
//     const user = localStorage.getItem('user');
//     if (!user) return '';

//     const parsed = JSON.parse(user);

//     return `${parsed.firstName} ${parsed.lastName}`;
//   }

//   getUser(): User | null {
//     const user = localStorage.getItem('user');
//     return user ? JSON.parse(user) : null;
//   }
// }

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
