import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const adminAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const isAdminLoggedIn = localStorage.getItem('adminSession') === 'true';
  const isAdminAuthPage = state.url.startsWith('/admin/login');

  if (isAdminLoggedIn && isAdminAuthPage) {
    return router.createUrlTree(['/admin']);
  }

  if (!isAdminLoggedIn && !isAdminAuthPage) {
    return router.createUrlTree(['/admin/login']);
  }

  return true;
};

// import { inject } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';
// import { map, take } from 'rxjs/operators';

// import { AdminAuthService } from '../services/admin-auth-service';

// export const adminAuthGuard: CanActivateFn = (route, state) => {
//   const router = inject(Router);
//   const adminService = inject(AdminAuthService);

//   return adminService.firebaseUser$.pipe(
//     take(1),
//     map((user) => {
//       const isAdminLoggedIn = !!user;
//       const isAdminAuthPage = state.url.startsWith('/admin/login');

//       if (isAdminLoggedIn && isAdminAuthPage) {
//         return router.createUrlTree(['/admin']);
//       }

//       if (!isAdminLoggedIn && !isAdminAuthPage) {
//         return router.createUrlTree(['/admin/login']);
//       }

//       return true;
//     }),
//   );
// };

////////////////////////////////////////////////////////////////

// import { inject } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';
// import { AdminAuthService } from '../services/admin-auth-service';

// export const adminAuthGuard: CanActivateFn = (route, state) => {
//   const router = inject(Router);
//   const adminService = inject(AdminAuthService);

//   const isAdminLoggedIn = adminService.isLoggedIn();
//   const url = state.url;

//   const isAdminAuthPage = url.startsWith('/admin/login');

//   if (isAdminLoggedIn && isAdminAuthPage) {
//     return router.createUrlTree(['/admin']);
//   }

//   if (!isAdminLoggedIn && !isAdminAuthPage) {
//     return router.createUrlTree(['/admin/login']);
//   }

//   return true;
// };
