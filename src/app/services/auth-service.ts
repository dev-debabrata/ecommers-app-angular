import { Injectable, inject, signal } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  authState,
  User as FirebaseUser,
} from '@angular/fire/auth';

import { Firestore, doc, docData, getDoc, serverTimestamp, setDoc } from '@angular/fire/firestore';

import { from, Observable, of, switchMap } from 'rxjs';

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

  signupUser(data: User, password: string): Observable<any> {
    return from(
      createUserWithEmailAndPassword(this.auth, data.email, password).then((result) => {
        const uid = result.user.uid;

        return updateProfile(result.user, {
          displayName: `${data.firstName} ${data.lastName}`,
        }).then(() => {
          return setDoc(doc(this.firestore, 'users/' + uid), {
            ...data,
            uid,
            role: 'user',
            createdAt: serverTimestamp(),
          }).then(() => result.user);
        });
      }),
    );
  }

  login(email: string, password: string): Observable<any> {
    return from(
      signInWithEmailAndPassword(this.auth, email, password).then(async (res) => {
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
      }),
    );
  }

  logout(): Observable<void> {
    return from(signOut(this.auth));
  }

  isLoggedIn(): boolean {
    return this.isAuthReady() && !!this.auth.currentUser && navigator.onLine;
  }

  getFullUser(): Observable<User | null> {
    const user = this.auth.currentUser;

    if (!user) {
      return of(null);
    }

    const userRef = doc(this.firestore, 'users/' + user.uid);

    return docData(userRef, { idField: 'uid' }) as Observable<User | null>;

    // return from(
    //   getDoc(userRef).then((snap) => {
    //     return snap.exists() ? (snap.data() as User) : null;
    //   }),
    // );
  }
}

// getFullUser(): Observable<User | null> {
//   return this.firebaseUser$.pipe(
//     switchMap((firebaseUser) => {
//       if (!firebaseUser) return of(null);

//       const userRef = doc(this.firestore, 'users/' + firebaseUser.uid);

//       return from(
//         getDoc(userRef).then((snap) => {
//           return snap.exists() ? (snap.data() as User) : null;
//         }),
//       );
//     }),
//   );
// }

//////////////////////////////////////////////////////////////////////////////
// async signupUser(data: User, password: string) {
//   const result = await createUserWithEmailAndPassword(this.auth, data.email, password);

//   const uid = result.user.uid;

//   await updateProfile(result.user, {
//     displayName: `${data.firstName} ${data.lastName}`,
//   });

//   await setDoc(doc(this.firestore, 'users/' + uid), {
//     ...data,
//     uid,
//     role: 'user',
//     createdAt: serverTimestamp(),
//   });

//   return result.user;
// }

// async login(email: string, password: string) {
//   const res = await signInWithEmailAndPassword(this.auth, email, password);

//   const uid = res.user.uid;

//   const userRef = doc(this.firestore, 'users/' + uid);
//   const snap = await getDoc(userRef);

//   if (!snap.exists()) {
//     await signOut(this.auth);
//     throw new Error('User not found');
//   }

//   const role = snap.data()?.['role'];

//   if (role !== 'user') {
//     await signOut(this.auth);
//     throw new Error('Unauthorized');
//   }

//   return res.user;
// }

// async logout() {
//   return await signOut(this.auth);
// }

// getUserRole(uid: string): Observable<'user' | 'admin'> {
//   const userRef = doc(this.firestore, 'users/' + uid);

//   return from(
//     getDoc(userRef).then((snap) => {
//       if (!snap.exists()) return 'user';

//       return (snap.data()?.['role'] as 'user' | 'admin') || 'user';
//     }),
//   );
// }

//////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////   JSON VERSION //////////////////////////////
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
