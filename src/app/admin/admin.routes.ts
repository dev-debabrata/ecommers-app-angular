import { Routes } from '@angular/router';

import { AdminLayout } from '../layouts/admin-layout/admin-layout';
import { Dashboard } from './dashboard/dashboard';
import { AdminLogin } from './auth/admin-login/admin-login';
import { adminAuthGuard } from '../guards/admin-auth-guard';
import { ProductList } from './products/product-list/product-list';

import { Orders } from './orders/orders';
import { UserList } from './users/user-list/user-list';

export const adminRoutes: Routes = [
  {
    path: 'login',
    component: AdminLogin,
    canActivate: [adminAuthGuard],
  },

  {
    path: '',
    component: AdminLayout,
    canActivate: [adminAuthGuard],
    children: [
      {
        path: '',
        component: Dashboard,
      },

      {
        path: 'users',
        children: [
          { path: '', component: UserList },
          {
            path: ':id',
            loadComponent: () =>
              import('./users/user-detail/user-detail').then((m) => m.UserDetail),
          },
        ],
      },

      {
        path: 'products',
        children: [
          { path: '', component: ProductList },
          {
            path: 'add-product',
            loadComponent: () =>
              import('./products/add-product/add-product').then((m) => m.AddProduct),
          },

          {
            path: 'edit/:id',
            loadComponent: () =>
              import('./products/add-product/add-product').then((m) => m.AddProduct),
          },
        ],
      },

      {
        path: 'orders',
        component: Orders,
      },
    ],
  },
];
