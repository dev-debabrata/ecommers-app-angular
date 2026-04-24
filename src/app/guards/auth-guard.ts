import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../services/auth-service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const snackBar = inject(MatSnackBar);

  const isLoggedIn = authService.isLoggedIn();
  const url = state.url;

  const isAuthPage = url.startsWith('/login') || url.startsWith('/signup');

  if (isLoggedIn && isAuthPage) {
    snackBar.open('You are already logged in', 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['snackbar-error'],
    });
    return router.createUrlTree(['/']);
  }

  if (!isLoggedIn && isAuthPage) {
    return true;
  }

  if (!isLoggedIn) {
    snackBar.open('Please login first', 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['snackbar-error'],
    });
    localStorage.setItem('redirectUrl', state.url);
    return router.createUrlTree(['/login']);
  }

  return true;
};
