import { Injectable, inject } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  signOut,
  authState,
  User as FirebaseUser,
} from '@angular/fire/auth';

import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { from, map, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);

  firebaseUser$: Observable<FirebaseUser | null> = authState(this.auth);

  loginAdmin(email: string, password: string) {
    return from(
      signInWithEmailAndPassword(this.auth, email, password).then(async (result) => {
        const uid = result.user.uid;

        const adminRef = doc(this.firestore, 'users/' + uid);
        const snap = await getDoc(adminRef);

        if (!snap.exists()) {
          await signOut(this.auth);
          throw new Error('Admin not found');
        }

        const role = snap.data()?.['role'];

        if (role !== 'admin') {
          await signOut(this.auth);
          throw new Error('Unauthorized');
        }

        return result.user;
      }),
    );
  }

  logout() {
    return from(
      signOut(this.auth).then(() => {
        this.router.navigateByUrl('/admin/login', { replaceUrl: true });
      }),
    );
  }

  isAdmin$ = this.firebaseUser$.pipe(
    switchMap((user) => {
      if (!user) return of(false);

      const adminRef = doc(this.firestore, 'users/' + user.uid);

      return from(getDoc(adminRef)).pipe(
        map((snap) => {
          if (!snap.exists()) return false;
          return snap.data()?.['role'] === 'admin';
        }),
      );
    }),
  );

  // isAdmin$ = this.firebaseUser$;
}

// async loginAdmin(email: string, password: string) {
//   const result = await signInWithEmailAndPassword(this.auth, email, password);

//   const uid = result.user.uid;

//   const adminRef = doc(this.firestore, 'users/' + uid);
//   const snap = await getDoc(adminRef);

//   if (!snap.exists()) {
//     await signOut(this.auth);
//     throw new Error('Admin not found');
//   }

//   const role = snap.data()?.['role'];

//   if (role !== 'admin') {
//     await signOut(this.auth);
//     throw new Error('Unauthorized');
//   }

//   return result.user;
// }

// async logout() {
//   await signOut(this.auth);
//   this.router.navigateByUrl('/admin/login', { replaceUrl: true });
// }

// async logout() {
//   await signOut(this.auth);
// }

////////////////////////////////////////////////////////////////////////////
///////////////////////////////// JSON VERSION /////////////////////////////
///////////////////////////////////////////////////////////////////////////

// import { inject, Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Router } from '@angular/router';
// import { Observable } from 'rxjs';

// import { Admin } from '../models/admin';

// @Injectable({
//   providedIn: 'root',
// })
// export class AdminAuthService {
//   private apiUrl = 'http://localhost:3000/admin';
//   private http = inject(HttpClient);
//   private router = inject(Router);

//   loginAdmin(email: string, password: string): Observable<Admin[]> {
//     return this.http.get<Admin[]>(`${this.apiUrl}?email=${email}&password=${password}`);
//   }

//   isLoggedIn(): boolean {
//     return !!localStorage.getItem('admin');
//   }

//   logout() {
//     localStorage.removeItem('admin');
//     this.router.navigate(['/admin/login']);
//   }
// }
