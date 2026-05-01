import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../../services/auth-service';
import { SnackbarService } from '../../../services/snackbar-service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    ReactiveFormsModule,
    CommonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  private router = inject(Router);
  private authService = inject(AuthService);
  private snackBar = inject(SnackbarService);

  isLoading = false;

  form = new FormGroup({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.email, Validators.required],
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });

  get email() {
    return this.form.controls.email;
  }

  get password() {
    return this.form.controls.password;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.snackBar.error('Please enter valid email and password');
      return;
    }

    const { email, password } = this.form.getRawValue();

    this.isLoading = true;

    const sub = this.authService.login(email, password).subscribe({
      next: (user) => {
        console.log(user);

        this.snackBar.success('Login successful');
        this.isLoading = false;

        const redirectUrl = localStorage.getItem('redirectUrl');

        if (redirectUrl) {
          localStorage.removeItem('redirectUrl');
          this.router.navigate([redirectUrl]);
        } else {
          this.router.navigate(['/']);
        }
      },

      error: (err: any) => {
        console.error(err);

        let message = 'Login failed';

        if (err.code === 'auth/user-not-found') {
          message = 'Email not registered';
          this.email.setErrors({ emailNotRegistered: true });
        }

        if (err.code === 'auth/wrong-password') {
          message = 'Invalid password';
          this.password.setErrors({ invalidPassword: true });
        }

        if (err.code === 'auth/invalid-email') {
          message = 'Invalid email format';
        }

        this.snackBar.error(message);
        this.isLoading = false;
      },
    });
  }
}

/////////////////////////////////////////////////////////////////////////////

// import { CommonModule } from '@angular/common';
// import { Component, inject } from '@angular/core';
// import { Router, RouterLink } from '@angular/router';
// import {
//   FormControl,
//   FormGroup,
//   FormsModule,
//   ReactiveFormsModule,
//   Validators,
// } from '@angular/forms';
// import { MatIconModule } from '@angular/material/icon';
// import { MatSnackBar } from '@angular/material/snack-bar';

// import { AuthService } from '../../../services/auth-service';

// @Component({
//   selector: 'app-login-page',
//   standalone: true,
//   imports: [FormsModule, RouterLink, ReactiveFormsModule, CommonModule, MatIconModule],
//   templateUrl: './login-page.html',
//   styleUrl: './login-page.css',
// })
// export class LoginPage {
//   private router = inject(Router);
//   private authService = inject(AuthService);
//   private snackBar = inject(MatSnackBar);

//   form = new FormGroup({
//     email: new FormControl<string>('', {
//       nonNullable: true,
//       validators: [Validators.email, Validators.required],
//     }),
//     password: new FormControl<string>('', {
//       nonNullable: true,
//       validators: [Validators.required, Validators.minLength(6)],
//     }),
//   });

//   get email() {
//     return this.form.controls.email;
//   }

//   get password() {
//     return this.form.controls.password;
//   }

//   showSnackbar(message: string, type: 'success' | 'error') {
//     this.snackBar.open(message, 'Close', {
//       duration: 3000,
//       horizontalPosition: 'center',
//       verticalPosition: 'top',
//       panelClass: [`snackbar-${type}`],
//     });
//   }
//   onSubmit() {
//     if (this.form.invalid) {
//       this.form.markAllAsTouched();
//       this.showSnackbar('Please enter valid email and password', 'error');
//       return;
//     }

//     const { email, password } = this.form.value;

//     this.authService.checkEmail(email!).subscribe({
//       next: (users: any[]) => {
//         if (users.length === 0) {
//           this.email.setErrors({ emailNotRegistered: true });
//           this.showSnackbar('Email not registered', 'error');
//           return;
//         }

//         const user = users[0];

//         if (user.password !== password) {
//           this.password.setErrors({ invalidPassword: true });
//           this.showSnackbar('Invalid password', 'error');
//           return;
//         }

//         this.authService.setToken('fake-token');
//         this.authService.setUser(user);

//         this.showSnackbar('Login successful', 'success');
//         this.router.navigate(['/']);

//         console.log(JSON.stringify(user));
//       },

//       error: () => {
//         this.showSnackbar('Something went wrong', 'error');
//       },
//     });
//   }
// }

/////////////////////////////////////////////////////////////////////////////////////

// async onSubmit() {
//   if (this.form.invalid) {
//     this.form.markAllAsTouched();
//     this.snackBar.error('Please enter valid email and password');
//     return;
//   }

//   const { email, password } = this.form.getRawValue();

//   this.loaderService.show();

//   try {
//     const user = await this.authService.login(email, password);

//     console.log(user);

//     this.snackBar.success('Login successful');
//     console.log();

//     this.loaderService.hide();

//     const redirectUrl = localStorage.getItem('redirectUrl');

//     if (redirectUrl) {
//       localStorage.removeItem('redirectUrl');
//       this.router.navigate([redirectUrl]);
//     } else {
//       this.router.navigate(['/']);
//     }
//   } catch (err: any) {
//     console.error(err);

//     let message = 'Login failed';

//     if (err.code === 'auth/user-not-found') {
//       message = 'Email not registered';
//       this.email.setErrors({ emailNotRegistered: true });
//     }

//     if (err.code === 'auth/wrong-password') {
//       message = 'Invalid password';
//       this.password.setErrors({ invalidPassword: true });
//     }

//     if (err.code === 'auth/invalid-email') {
//       message = 'Invalid email format';
//     }

//     this.snackBar.error(message);
//     this.loaderService.hide();
//   }
// }
