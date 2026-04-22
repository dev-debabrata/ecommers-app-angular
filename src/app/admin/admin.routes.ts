import { Routes } from '@angular/router';

import { AdminLayout } from '../layouts/admin-layout/admin-layout';
import { Dashboard } from './dashboard/dashboard';
import { AdminLogin } from './auth/admin-login/admin-login';
import { adminAuthGuard } from '../guards/admin-auth-guard';
import { ProductList } from './products/product-list/product-list';
import { AddProduct } from './products/add-product/add-product';
import { Users } from './users/users';
import { Orders } from './orders/orders';

export const adminRoutes: Routes = [
  {
    path: 'login',
    component: AdminLogin,
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
        component: Users,
      },

      {
        path: 'products',
        children: [
          { path: '', component: ProductList },
          { path: 'add-product', component: AddProduct },
        ],
      },

      {
        path: 'orders',
        component: Orders,
      },
    ],
  },
];
