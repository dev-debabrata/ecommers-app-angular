import { Routes } from '@angular/router';
import { HomePage } from './pages/home-page/home-page';
import { LoginPage } from './pages/auth/login-page/login-page';
import { SignupPage } from './pages/auth/signup-page/signup-page';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },

  { path: 'login', component: LoginPage, data: { hideLayout: true } },
  { path: 'signup', component: SignupPage, data: { hideLayout: true } },
];
