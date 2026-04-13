import { Routes } from '@angular/router';
import { HomePage } from './pages/home-page/home-page';
import { LoginPage } from './pages/auth/login-page/login-page';
import { SignupPage } from './pages/auth/signup-page/signup-page';
import { ProductListPage } from './pages/products/product-list-page/product-list-page';
import { authGuard } from './guards/auth-guard';
import { NotFound } from './components/not-found/not-found';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },

  { path: 'login', component: LoginPage, data: { hideLayout: true } },
  { path: 'signup', component: SignupPage, data: { hideLayout: true } },

  {
    path: 'products',
    data: { breadcrumb: 'Products' },
    children: [
      {
        path: '',
        component: ProductListPage,
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./pages/products/product-detail-page/product-detail-page').then(
            (m) => m.ProductDetailPage,
          ),
      },
    ],
  },

  {
    path: 'cart',
    loadComponent: () => import('./pages/cart-page/cart-page').then((m) => m.CartPage),
    data: { breadcrumb: 'Cart' },
    canActivate: [authGuard],
  },

  {
    path: '**',
    component: NotFound,
    data: { hideLayout: true, hideBreadcrumb: true },
  },
];
