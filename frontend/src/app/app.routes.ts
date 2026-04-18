import { Routes } from '@angular/router';

import { HomePage } from './pages/home-page/home-page';
import { LoginPage } from './pages/auth/login-page/login-page';
import { SignupPage } from './pages/auth/signup-page/signup-page';
import { ProductListPage } from './pages/products/product-list-page/product-list-page';
import { authGuard } from './guards/auth-guard';
import { NotFound } from './components/not-found/not-found';
import { CartPage } from './pages/cart-page/cart-page';
import { CheckoutPage } from './pages/checkout-page/checkout-page';
import { WishlistPage } from './pages/wishlist-page/wishlist-page';
import { AboutPage } from './pages/about-page/about-page';
import { ContactPage } from './pages/contact-page/contact-page';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },

  {
    path: 'about',
    component: AboutPage,
    data: { breadcrumb: 'About' },
  },

  {
    path: 'contact',
    component: ContactPage,
    data: { breadcrumb: 'Contact' },
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
    canActivate: [authGuard],
    data: { breadcrumb: 'Cart' },
    children: [
      {
        path: '',
        component: CartPage,
      },
      {
        path: 'checkout',
        component: CheckoutPage,
        data: { breadcrumb: 'Checkout' },
      },
    ],
  },

  {
    path: 'wishlist',
    component: WishlistPage,
    canActivate: [authGuard],
    data: { breadcrumb: 'Wishlist' },
  },

  {
    path: '**',
    component: NotFound,
    data: { hideLayout: true, hideBreadcrumb: true },
  },
];
