import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AdminAuthService } from '../../../services/admin-auth-service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.css',
})
export class AdminLogin {
  private router = inject(Router);
  private adminAuthService = inject(AdminAuthService);
  private snackBar = inject(MatSnackBar);

  loginForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  async onSubmit() {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.getRawValue();

    try {
      await this.adminAuthService.loginAdmin(email, password);

      this.snackBar.open('Admin login successfully!', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['snackbar-success'],
      });

      this.router.navigate(['/admin']);
    } catch (error: any) {
      let message = 'Login failed';

      if (error.message === 'Unauthorized') {
        message = 'Only admin can login';
      }

      if (error.message === 'Admin not found') {
        message = 'Admin not found';
      }

      this.snackBar.open(message, 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['snackbar-error'],
      });

      console.error(error);
    }
  }
}

// import { Component, inject } from '@angular/core';
// import { Router } from '@angular/router';
// import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { MatSnackBar } from '@angular/material/snack-bar';

// import { AdminAuthService } from '../../../services/admin-auth-service';

// @Component({
//   selector: 'app-admin-login',
//   imports: [ReactiveFormsModule],
//   templateUrl: './admin-login.html',
//   styleUrl: './admin-login.css',
// })
// export class AdminLogin {
//   private router = inject(Router);
//   private adminAuthService = inject(AdminAuthService);

//   private snackBar = inject(MatSnackBar);

//   loginForm = new FormGroup({
//     email: new FormControl('', [Validators.required, Validators.email]),
//     password: new FormControl('', [Validators.required]),
//   });

//   onSubmit() {
//     if (this.loginForm.invalid) return;

//     const email = this.loginForm.value.email!;
//     const password = this.loginForm.value.password!;

//     this.adminAuthService.loginAdmin(email, password).subscribe({
//       next: (res) => {
//         if (res.length > 0) {
//           localStorage.setItem('admin', JSON.stringify(res[0]));

//           this.snackBar.open('Admin login Successfully!', 'Close', {
//             duration: 3000,
//             horizontalPosition: 'center',
//             verticalPosition: 'top',
//             panelClass: [`snackbar-success`],
//           });
//           this.router.navigate(['/admin']);
//         } else {
//           this.snackBar.open('Invalid credentials', 'Close', {
//             duration: 3000,
//             horizontalPosition: 'center',
//             verticalPosition: 'top',
//             panelClass: [`snackbar-error`],
//           });
//         }
//       },
//       error: () => {
//         this.snackBar.open('Server error', 'Close', {
//           duration: 3000,
//           horizontalPosition: 'center',
//           verticalPosition: 'top',
//           panelClass: ['snackbar-error'],
//         });
//       },
//     });
//   }
// }
