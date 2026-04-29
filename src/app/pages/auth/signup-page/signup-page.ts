import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { from, map, of } from 'rxjs';

import { AuthService } from '../../../services/auth-service';
import { User } from '../../../models/user';
import { SnackbarService } from '../../../services/snackbar-service';
import { LoaderService } from '../../../services/loader-service';

@Component({
  selector: 'app-signup-page',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './signup-page.html',
  styleUrl: './signup-page.css',
})
export class SignupPage {
  private router = inject(Router);
  private authService = inject(AuthService);
  private snackBar = inject(SnackbarService);
  private loaderService = inject(LoaderService);

  form = new FormGroup(
    {
      firstName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),

      lastName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),

      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
        // asyncValidators: [this.checkEmailAvailability()],
        // updateOn: 'blur',
      }),

      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(6)],
      }),

      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),

      phoneNumber: new FormArray<FormControl<string>>([new FormControl('', { nonNullable: true })]),
    },
    {
      validators: [this.passwordMatch],
    },
  );

  passwordMatch(group: AbstractControl) {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;

    return password === confirm ? null : { passwordMismatch: true };
  }

  // checkEmailAvailability(): AsyncValidatorFn {
  //   return (control: AbstractControl) => {
  //     if (!control.value) return of(null);

  //     return from(this.authService.checkEmail(control.value)).pipe(
  //       map((exists) => (exists ? { emailTaken: true } : null)),
  //     );
  //   };
  // }

  get phoneNumber() {
    return this.form.get('phoneNumber') as FormArray;
  }

  addPhone() {
    this.phoneNumber.push(new FormControl('', { nonNullable: true }));
  }

  removePhone(index: number) {
    this.phoneNumber.removeAt(index);
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.snackBar.error('Please fill all fields correctly');
      return;
    }

    const value = this.form.getRawValue();

    const user: User = {
      firstName: value.firstName,
      lastName: value.lastName,
      email: value.email,
      phoneNumber: value.phoneNumber,
    };

    this.loaderService.show();

    try {
      await this.authService.signupUser(user, value.password);

      this.snackBar.success('Signup successful');
      this.form.reset();
      this.loaderService.hide();
      this.router.navigate(['/']);
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        this.snackBar.error('Email already exists');
      } else {
        this.snackBar.error('Signup failed');
      }

      console.error(error);
      this.loaderService.hide();
    }
  }

  // async onSubmit() {
  //   if (this.form.invalid) {
  //     this.form.markAllAsTouched();
  //     this.showSnackbar('Please fill all fields correctly', 'error');
  //     return;
  //   }

  //   const value = this.form.getRawValue();

  //   const user: User = {
  //     firstName: value.firstName,
  //     lastName: value.lastName,
  //     email: value.email,
  //     phoneNumber: value.phoneNumber,
  //   };

  //   try {
  //     await this.authService.signupUser(user, value.password);

  //     this.showSnackbar('Signup successful', 'success');
  //     this.router.navigate(['/']);
  //   } catch (error) {
  //     this.showSnackbar('Signup failed', 'error');
  //     console.error(error);
  //   }
  // }

  get firstName() {
    return this.form.controls.firstName;
  }

  get lastName() {
    return this.form.controls.lastName;
  }

  get email() {
    return this.form.controls.email;
  }

  get password() {
    return this.form.controls.password;
  }

  get confirmPassword() {
    return this.form.controls.confirmPassword;
  }
}

// import { CommonModule } from '@angular/common';
// import { Component, inject } from '@angular/core';
// import {
//   AbstractControl,
//   FormArray,
//   FormControl,
//   FormGroup,
//   FormsModule,
//   ReactiveFormsModule,
//   Validators,
// } from '@angular/forms';
// import { MatIconModule } from '@angular/material/icon';
// import { Router, RouterLink } from '@angular/router';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { delay, map, of } from 'rxjs';

// import { AuthService } from '../../../services/auth-service';
// import { User } from '../../../models/user';

// @Component({
//   selector: 'app-signup-page',
//   standalone: true,
//   imports: [FormsModule, RouterLink, CommonModule, ReactiveFormsModule, MatIconModule],
//   templateUrl: './signup-page.html',
//   styleUrl: './signup-page.css',
// })
// export class SignupPage {
//   private router = inject(Router);
//   private authService = inject(AuthService);
//   private snackBar = inject(MatSnackBar);

//   form = new FormGroup(
//     {
//       firstName: new FormControl<string>('', {
//         nonNullable: true,
//         validators: [Validators.required],
//       }),

//       lastName: new FormControl<string>('', {
//         nonNullable: true,
//         validators: [Validators.required],
//       }),

//       email: new FormControl<string>('', {
//         nonNullable: true,
//         validators: [Validators.email, Validators.required],
//         asyncValidators: [this.checkEmailAvailability()],
//         updateOn: 'blur',
//       }),

//       password: new FormControl<string>('', {
//         nonNullable: true,
//         validators: [Validators.required, Validators.minLength(6)],
//       }),

//       confirmPassword: new FormControl<string>('', {
//         nonNullable: true,
//         validators: [Validators.required],
//       }),
//       // phoneNumber: new FormArray([new FormControl('', { nonNullable: true })]),
//       phoneNumber: new FormArray<FormControl<string>>([new FormControl('', { nonNullable: true })]),
//     },
//     {
//       validators: [this.passwordMatch],
//     },
//   );

//   passwordMatch(group: AbstractControl) {
//     const password = group.get('password')?.value;
//     const confirm = group.get('confirmPassword')?.value;

//     if (password === confirm) {
//       return null;
//     }
//     return { passwordMismatch: true };
//   }

//   checkEmailAvailability() {
//     return (control: AbstractControl) => {
//       if (!control.value) return of(null);

//       return this.authService.checkEmail(control.value).pipe(
//         delay(500),
//         map((users: any[]) => (users.length ? { emailTaken: true } : null)),
//       );
//     };
//   }

//   get phoneNumber() {
//     return this.form.get('phoneNumber') as FormArray;
//   }

//   addPhone() {
//     this.phoneNumber.push(new FormControl('', { nonNullable: true }));
//   }

//   removePhone(index: number) {
//     this.phoneNumber.removeAt(index);
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
//       this.showSnackbar('Please fill all fields correctly', 'error');
//       return;
//     }

//     const value = this.form.getRawValue();

//     const user: User = {
//       firstName: value.firstName,
//       lastName: value.lastName,
//       email: value.email,
//       password: value.password,
//       phoneNumber: value.phoneNumber,
//     };

//     this.authService.signupUser(user).subscribe({
//       next: (res) => {
//         this.authService.setToken('fake-token');
//         this.authService.setUser(res);
//         this.showSnackbar('Signup successful', 'success');
//         this.router.navigate(['/']);
//         console.log(res);

//         // setTimeout(() => this.router.navigate(['/']), 500);
//       },

//       error: (err) => {
//         this.showSnackbar('Signup failed', 'error');
//         console.log(err);
//       },
//     });
//   }

//   get firstName() {
//     return this.form.controls.firstName;
//   }

//   get lastName() {
//     return this.form.controls.lastName;
//   }

//   get email() {
//     return this.form.controls.email;
//   }

//   get password() {
//     return this.form.controls.password;
//   }

//   get confirmPassword() {
//     return this.form.controls.confirmPassword;
//   }
// }
