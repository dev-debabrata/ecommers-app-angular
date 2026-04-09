import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule, RouterLink, ReactiveFormsModule, CommonModule, MatIconModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  constructor(private router: Router) {}

  form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.email, Validators.required],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  get emailIsInvalid() {
    return this.email?.invalid && this.email?.touched;
  }

  get passwordIsInvalid() {
    return this.password?.invalid && this.password?.touched;
  }

  get emailError(): string {
    if (!this.emailIsInvalid) return '';

    if (this.email?.errors?.['required']) {
      return 'Email is required.';
    }

    if (this.email?.errors?.['email']) {
      return 'Enter a valid email.';
    }

    return '';
  }

  get passwordError(): string {
    if (!this.passwordIsInvalid) return '';

    if (this.password?.errors?.['required']) {
      return 'Password is required.';
    }

    if (this.password?.errors?.['minlength']) {
      return 'Password must be at least 6 characters.';
    }

    return '';
  }

  // get email() {
  //   return this.form.get('email');
  // }

  // get password() {
  //   return this.form.get('password');
  // }

  // get emailIsInvalid() {
  //   const email = this.form.controls.email;
  //   return email.invalid && email.touched;
  // }

  // get passwordIsInvalid() {
  //   const password = this.form.controls.password;
  //   return password.invalid && password.touched;
  // }

  // get combinedErrors(): string {
  //   const errors: string[] = [];

  //   if (this.emailIsInvalid) {
  //     if (this.form.controls.email.errors?.['required']) errors.push('Email is required.');
  //     if (this.form.controls.email.errors?.['email']) errors.push('Enter a valid email.');
  //   }

  //   if (this.passwordIsInvalid) {
  //     if (this.form.controls.password.errors?.['required']) errors.push('Password is required.');
  //     if (this.form.controls.password.errors?.['minlength'])
  //       errors.push('Password must be at least 6 characters.');
  //   }

  //   return errors.join(' ');
  // }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const enteredEmail = this.form.value.email;
    const enteredPassword = this.form.value.password;
    console.log(enteredEmail, enteredPassword);

    localStorage.setItem('isLoggedIn', 'true');
    this.router.navigate(['/']);
  }
}

// get emailIsInvalid() {
//   return this.email?.invalid && (this.email?.touched || this.email?.dirty);
// }

// get passwordIsInvalid() {
//   return this.password?.invalid && (this.password?.touched || this.password?.dirty);
// }

// get emailIsInvalid() {
//   const email = this.form.controls.email;
//   return email.touched && email.dirty && email.invalid;
// }

// get passwordIsInvalid() {
//   const password = this.form.controls.password;
//   return password.touched && password.dirty && password.invalid;
// }

// Combined error line (optional)

// get emailIsInvalid() {
//   return (
//     this.form.controls.email.touched &&
//     this.form.controls.email.dirty &&
//     this.form.controls.email.invalid
//   );
// }

// get passwordIsInvalid() {
//   return (
//     this.form.controls.password.touched &&
//     this.form.controls.password.dirty &&
//     this.form.controls.password.invalid
//   );
// }

//   get emailIsInvalid() {
//   const control = this.form.controls.email;
//   return control.invalid && (control.touched || control.dirty);
// }

// get passwordIsInvalid() {
//   const control = this.form.controls.password;
//   return control.invalid && (control.touched || control.dirty);
// }

// email = '';
// password = '';

// constructor(private router: Router) {}

// onLogin() {
//   localStorage.setItem('isLoggedIn', 'true');
//   this.router.navigate(['/']);
// }

// import { Component } from '@angular/core';
// import { FormControl, FormGroup, Validators } from '@angular/forms';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css']
// })
// export class LoginComponent {

//   loginForm = new FormGroup({
//     email: new FormControl<string>('', {
//       nonNullable: true,
//       validators: [Validators.required, Validators.email]
//     }),
//     password: new FormControl<string>('', {
//       nonNullable: true,
//       validators: [Validators.required, Validators.minLength(6)]
//     })
//   });

//   /** Helper for error display */
//   getError(controlName: 'email' | 'password', errorName: string) {
//     const control = this.loginForm.get(controlName);
//     return control?.hasError(errorName) && (control.dirty || control.touched);
//   }

//   /** Submit */
//   onSubmit() {
//     if (this.loginForm.valid) {
//       console.log('Login Data:', this.loginForm.value);
//       // Call API here
//     }
//   }
// }
