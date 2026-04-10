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
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { delay, map, Observable, of } from 'rxjs';

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
  private snackBar = inject(MatSnackBar);

  form = new FormGroup(
    {
      firstName: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),

      lastName: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),

      email: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.email, Validators.required],
      }),

      password: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(6)],
      }),

      confirmPassword: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      phoneNumber: new FormArray<FormControl<string>>([new FormControl('', { nonNullable: true })]),
    },
    {
      validators: [this.passwordMatch],
    },
  );

  // Password Match

  // passwordMatch(control: AbstractControl) {
  //   const password = control.get('password');
  //   const confirmPassword = control.get('confirmPassword');

  //   if (!password || !confirmPassword) return null;

  //   if (password.value !== confirmPassword.value) {
  //     confirmPassword.setErrors({ passwordNotEqual: true });
  //     return { passwordNotEqual: true };
  //   }

  //   // confirmPassword.setErrors(null);
  //   return null;
  // }
  // passwordMatch(control: AbstractControl) {
  //   const password = control.get('password')?.value;
  //   const confirmPassword = control.get('confirmPassword')?.value;

  //   if (password === confirmPassword) {
  //     return null;
  //   }

  //   return { passwordNotEqual: true };
  // }

  passwordMatch(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;

    return password === confirm ? null : { passwordMismatch: true };
  }

  checkEmailAvailability(): AsyncValidatorFn {
    const takenEmails = ['admin@gmail.com', 'test@gmail.com'];

    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return of(takenEmails.includes(control.value)).pipe(
        delay(1500),
        map((taken) => (taken ? { emailTaken: true } : null)),
      );
    };
  }

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

  get phoneNumber() {
    return this.form.get('phoneNumber') as FormArray;
  }

  // // VALIDATION STATES
  // get emailIsInvalid() {
  //   return this.email?.invalid && this.email?.touched;
  // }

  // get passwordIsInvalid() {
  //   return this.password?.invalid && this.password?.touched;
  // }

  // get confirmPasswordIsInvalid() {
  //   return this.confirmPassword?.invalid && this.confirmPassword?.touched;
  // }

  // ERROR MESSAGES
  // get emailError(): string {
  //   if (!this.emailIsInvalid) return '';

  //   if (this.email?.errors?.['required']) {
  //     return 'Email is required.';
  //   }
  //   if (this.email?.errors?.['email']) {
  //     return 'Enter a valid email.';
  //   }
  //   if (this.email?.errors?.['emailTaken']) {
  //     return 'This email is already registered!';
  //   }

  //   return '';
  // }

  // get passwordError(): string {
  //   if (!this.passwordIsInvalid) return '';

  //   if (this.password?.errors?.['required']) {
  //     return 'Password is required.';
  //   }
  //   if (this.password?.errors?.['minlength']) {
  //     return 'Password must be at least 6 characters.';
  //   }

  //   return '';
  // }

  // get confirmPasswordError(): string {
  //   if (!this.confirmPassword?.touched) return '';

  //   if (this.confirmPassword?.errors?.['required']) {
  //     return 'Confirm password is required';
  //   }

  //   if (this.form?.errors?.['passwordNotEqual']) {
  //     return 'Passwords do not match';
  //   }

  //   return '';
  // }

  addPhone() {
    this.phoneNumber.push(new FormControl('', { nonNullable: true }));
  }

  removePhone(index: number) {
    this.phoneNumber.removeAt(index);
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    const user = {
      firstName: value.firstName,
      lastName: value.lastName,
      email: value.email,
      password: value.password,
      phoneNumber: value.phoneNumber,
    };

    this.authService.checkEmail(user.email).subscribe({
      next: (res) => {
        if (!res.available) {
          this.email?.setErrors({ emailTaken: true });
          this.email?.markAsTouched();
          return;
        }

        this.authService.signupUser(user).subscribe({
          next: () => {
            console.log('Signup successful');

            this.authService.setToken('fake-token');

            this.router.navigate(['/']);

            this.snackBar.open('Login successful', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['snackbar-success'],
            });
          },
          error: (err) => {
            const message = err?.error?.message || 'Invalid email or password';

            if (message.toLowerCase().includes('invalid')) {
              this.email?.setErrors({ notRegistered: true });
              this.email?.markAsTouched();
            }
            this.snackBar.open(message, 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['snackbar-error'],
            });
          },
        });
      },
    });
  }
}

// import { Component } from '@angular/core';
// import { FormBuilder, FormControl, FormGroup, Validators, FormArray, AbstractControl, AsyncValidatorFn } from '@angular/forms';
// import { Observable, of } from 'rxjs';
// import { delay, map } from 'rxjs/operators';

// @Component({
//   selector: 'app-registration',
//   templateUrl: './registration.component.html',
//   styleUrls: ['./registration.component.css']
// })
// export class RegistrationComponent {
//   registrationForm: FormGroup<{
//     firstName: FormControl<string>;
//     lastName: FormControl<string>;
//     email: FormControl<string>;
//     password: FormControl<string>;
//     confirmPassword: FormControl<string>;
//     phones: FormArray<FormControl<string>>;
//   }>;

//   constructor(private fb: FormBuilder) {
//     this.registrationForm = this.fb.group({
//       firstName: new FormControl('', { validators: [Validators.required] }),
//       lastName: new FormControl('', { validators: [Validators.required] }),
//       email: new FormControl('', {
//         validators: [Validators.required, Validators.email],
//         asyncValidators: [this.checkEmailAvailability()],
//         updateOn: 'blur'
//       }),
//       password: new FormControl('', { validators: [Validators.required, Validators.minLength(6)] }),
//       confirmPassword: new FormControl('', { validators: [Validators.required] }),
//       phones: this.fb.array([new FormControl('', Validators.required)])
//     }, { validators: this.passwordMatch });
//   }

//   /** Custom Validator: Passwords must match */
//   passwordMatch(group: AbstractControl) {
//     const password = group.get('password')?.value;
//     const confirm = group.get('confirmPassword')?.value;
//     return password === confirm ? null : { passwordMismatch: true };
//   }

//   /** Async Validator: Simulate email availability check */
//   checkEmailAvailability(): AsyncValidatorFn {
//     return (control: AbstractControl): Observable<{ emailTaken: boolean } | null> => {
//       const takenEmails = ['test@example.com', 'admin@example.com'];
//       return of(takenEmails.includes(control.value)).pipe(
//         delay(1000), // simulate network latency
//         map(isTaken => (isTaken ? { emailTaken: true } : null))
//       );
//     };
//   }

//   /** Getter for phones FormArray */
//   get phones(): FormArray<FormControl<string>> {
//     return this.registrationForm.get('phones') as FormArray<FormControl<string>>;
//   }

//   /** Add a phone input */
//   addPhone() {
//     this.phones.push(new FormControl('', Validators.required));
//   }

//   /** Remove a phone input */
//   removePhone(index: number) {
//     this.phones.removeAt(index);
//   }

//   /** Submit form */
//   onSubmit() {
//     if (this.registrationForm.valid) {
//       console.log('Form Submitted:', this.registrationForm.value);
//     }
//   }

//   /** Helper to display form control errors */
//   getError(control: AbstractControl | null, errorName: string) {
//     return control?.hasError(errorName) && (control.dirty || control.touched);
//   }
// }
