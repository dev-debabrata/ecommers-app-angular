import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  doc,
  getDoc,
  query,
  orderBy,
} from '@angular/fire/firestore';
import { Observable, from, map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private firestore = inject(Firestore);

  createOrder(userId: string, order: any) {
    const fullOrder = {
      ...order,
      userId,
      createdAt: Date.now(),
    };

    const userOrdersRef = collection(this.firestore, `users/${userId}/orders`);
    const globalOrdersRef = collection(this.firestore, 'orders');

    return from(addDoc(userOrdersRef, fullOrder)).pipe(
      switchMap((userOrder) =>
        from(
          addDoc(globalOrdersRef, {
            ...fullOrder,
            userOrderId: userOrder.id,
          }),
        ).pipe(map(() => userOrder)),
      ),
    );
  }

  // async createOrder(userId: string, order: any) {
  //   const fullOrder = {
  //     ...order,
  //     userId,
  //     createdAt: Date.now(),
  //   };

  //   const userOrdersRef = collection(this.firestore, `users/${userId}/orders`);
  //   const userOrder = await addDoc(userOrdersRef, fullOrder);

  //   const globalOrdersRef = collection(this.firestore, 'orders');
  //   await addDoc(globalOrdersRef, {
  //     ...fullOrder,
  //     userOrderId: userOrder.id,
  //   });

  //   return userOrder;
  // }

  getUserOrders(userId: string): Observable<any[]> {
    const ordersRef = collection(this.firestore, `users/${userId}/orders`);
    const q = query(ordersRef, orderBy('createdAt', 'desc'));

    return collectionData(q, { idField: 'id' }) as Observable<any[]>;
  }

  getOrderById(userId: string, orderId: string): Observable<any | null> {
    const orderRef = doc(this.firestore, `users/${userId}/orders/${orderId}`);

    return from(getDoc(orderRef)).pipe(
      map((snap) => {
        if (!snap.exists()) return null;

        const data = snap.data();

        return {
          id: snap.id,
          ...data,
        };
      }),
    );
  }

  getAllOrders(): Observable<any[]> {
    const ordersRef = collection(this.firestore, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));

    return collectionData(q, { idField: 'id' }) as Observable<any[]>;
  }
}

///////////////////////////////////////////////////////////////////////////
//   async createOrder(userId: string, order: any) {
//   const userOrdersRef = collection(this.firestore, `users/${userId}/orders`);

//   const fullOrder = {
//     ...order,
//     userId,
//     createdAt: Date.now(),
//   };

//   // user-level order
//   const userOrder = await addDoc(userOrdersRef, fullOrder);

//   // admin-level order
//   const globalOrdersRef = collection(this.firestore, 'orders');
//   await addDoc(globalOrdersRef, {
//     ...fullOrder,
//     userOrderId: userOrder.id,
//   });

//   return userOrder;
// }

////////////////////////////////////////////////////////////////////////
// async createOrder(userId: string, order: any) {
//   const ordersRef = collection(this.firestore, `users/${userId}/orders`);

//   return await addDoc(ordersRef, {
//     ...order,
//     createdAt: Date.now(),
//   });
// }
