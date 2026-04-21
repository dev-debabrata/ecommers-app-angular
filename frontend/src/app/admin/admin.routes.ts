import { Routes } from '@angular/router';
import { AdminLayout } from '../layouts/admin-layout/admin-layout';
import { Dashboard } from './dashboard/dashboard';
import { AdminLogin } from './auth/admin-login/admin-login';
// import { ProductList } from './products/product-list/product-list';
// import { AddProduct } from './products/add-product/add-product';

export const adminRoutes: Routes = [
  {
    path: 'login',
    component: AdminLogin,
  },

  {
    path: '',
    component: AdminLayout,
    children: [
      {
        path: '',
        component: Dashboard,
      },
      // {
      //   path: 'products',
      //   component: ProductList,
      // },
      // {
      //   path: 'add-product',
      //   component: AddProduct,
      // },
    ],
  },
];
