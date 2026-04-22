import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const admin = localStorage.getItem('admin');

  if (admin) {
    return true;
  }

  router.navigate(['/admin/login']);
  return false;
};
