import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  deleteDoc,
  getDoc,
  docData,
  updateDoc,
} from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private firestore = inject(Firestore);

  getUsers(): Observable<any[]> {
    const usersRef = collection(this.firestore, 'users');
    return collectionData(usersRef, { idField: 'id' }) as Observable<any[]>;
  }

  getUserById(uid: string): Observable<any> {
    const userRef = doc(this.firestore, `users/${uid}`);
    return docData(userRef, { idField: 'uid' });
  }

  deleteUser(id: string): Observable<void> {
    const userDoc = doc(this.firestore, `users/${id}`);
    return from(deleteDoc(userDoc));
  }

  updateUserAddress(uid: string, data: any): Observable<void> {
    const userRef = doc(this.firestore, `users/${uid}`);
    return from(updateDoc(userRef, data));
  }

  deleteUserAddress(uid: string, addresses: any[]): Observable<void> {
    const userRef = doc(this.firestore, `users/${uid}`);
    return from(updateDoc(userRef, { addresses }));
  }
}

////////////////////////////////////////////////////////////////////

// updateUserAddress(uid: string, data: any) {
//   const userRef = doc(this.firestore, `users/${uid}`);
//   return updateDoc(userRef, data);
// }

// deleteUser(id: string) {
//   const userDoc = doc(this.firestore, `users/${id}`);
//   return deleteDoc(userDoc);
// }
