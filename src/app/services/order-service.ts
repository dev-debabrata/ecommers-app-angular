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
  updateDoc,
  setDoc,
} from '@angular/fire/firestore';
import { Observable, forkJoin, from, map, switchMap } from 'rxjs';
import { Order } from '../models/order-item';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private firestore = inject(Firestore);

  createOrder(userId: string, order: Order): Observable<Order> {
    const orderId = doc(collection(this.firestore, 'orders')).id;

    const fullOrder: Order = {
      ...order,
      id: orderId,
      userId,
      createdAt: Date.now(),
      status: 'pending',
    };

    const userOrderRef = doc(this.firestore, `users/${userId}/orders/${orderId}`);
    const globalOrderRef = doc(this.firestore, `orders/${orderId}`);

    return from(setDoc(userOrderRef, fullOrder)).pipe(
      switchMap(() => from(setDoc(globalOrderRef, fullOrder))),
      map(() => fullOrder),
    );
  }

  getUserOrders(userId: string): Observable<Order[]> {
    const ordersRef = collection(this.firestore, `users/${userId}/orders`);
    const q = query(ordersRef, orderBy('createdAt', 'desc'));

    return collectionData(q, { idField: 'id' }) as Observable<Order[]>;
  }

  getOrderById(userId: string, orderId: string): Observable<Order | null> {
    const orderRef = doc(this.firestore, `users/${userId}/orders/${orderId}`);

    return from(getDoc(orderRef)).pipe(
      map((snap) => {
        if (!snap.exists()) return null;

        return {
          id: snap.id,
          ...snap.data(),
        } as Order;
      }),
    );
  }

  getAllOrders(): Observable<Order[]> {
    const ordersRef = collection(this.firestore, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));

    return collectionData(q, { idField: 'id' }) as Observable<any[]>;
  }

  updateOrderStatus(
    userId: string,
    userOrderId: string,
    globalOrderId: string,
    status: Order['status'],
  ) {
    const userOrderRef = doc(this.firestore, `users/${userId}/orders/${userOrderId}`);
    const globalOrderRef = doc(this.firestore, `orders/${globalOrderId}`);

    return forkJoin([
      from(updateDoc(userOrderRef, { status })),
      from(updateDoc(globalOrderRef, { status })),
    ]);
  }
}

////////////////////////////////////////////////////////////////////////////

// createOrder(userId: string, order: any) {
//   const fullOrder = {
//     ...order,
//     userId,
//     createdAt: Date.now(),
//     status: 'pending',
//   };

//   const userOrdersRef = collection(this.firestore, `users/${userId}/orders`);
//   const globalOrdersRef = collection(this.firestore, 'orders');

//   return from(addDoc(userOrdersRef, fullOrder)).pipe(
//     switchMap((userOrder) =>
//       from(
//         addDoc(globalOrdersRef, {
//           ...fullOrder,
//           userOrderId: userOrder.id,
//         }),
//       ).pipe(map(() => userOrder)),
//     ),
//   );
// }

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
