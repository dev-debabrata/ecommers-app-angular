import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { delay, map, of } from 'rxjs';

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
        asyncValidators: [this.checkEmailAvailability()],
        updateOn: 'blur',
      }),

      password: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(6)],
      }),

      confirmPassword: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      // phoneNumber: new FormArray([new FormControl('', { nonNullable: true })]),
      phoneNumber: new FormArray<FormControl<string>>([new FormControl('', { nonNullable: true })]),
    },
    {
      validators: [this.passwordMatch],
    },
  );

  passwordMatch(group: AbstractControl) {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;

    if (password === confirm) {
      return null;
    }

    return { passwordMismatch: true };
  }

  // passwordMatch(group: AbstractControl): ValidationErrors | null {
  //   const password = group.get('password')?.value;
  //   const confirm = group.get('confirmPassword')?.value;

  //   if (!password || !confirm) {
  //     return null;
  //   }

  //   return password === confirm ? null : { passwordMismatch: true };
  // }

  // passwordMatch(group: AbstractControl): ValidationErrors | null {
  //   const password = group.get('password')?.value;
  //   const confirm = group.get('confirmPassword')?.value;

  //   return password === confirm ? null : { passwordMismatch: true };
  // }

  checkEmailAvailability() {
    return (control: AbstractControl) => {
      if (!control.value) return of(null);

      return this.authService.checkEmail(control.value).pipe(
        delay(500),
        map((users: any[]) => (users.length ? { emailTaken: true } : null)),
      );
    };
  }

  // checkEmailAvailability(): AsyncValidatorFn {
  //   return (control: AbstractControl): Observable<ValidationErrors | null> => {
  //     if (!control.value) return of(null);

  //     return this.authService.checkEmail(control.value).pipe(
  //       delay(500),
  //       map((users: any[]) => {
  //         return users.length > 0 ? { emailTaken: true } : null;
  //       }),
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

  showSnackbar(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: [`snackbar-${type}`],
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.showSnackbar('Please fill all fields correctly', 'error');
      return;
    }

    this.authService.signupUser(this.form.value).subscribe({
      next: () => {
        this.authService.setToken('fake-token');
        this.showSnackbar('Signup successful', 'success');
        this.router.navigate(['/']);

        // setTimeout(() => this.router.navigate(['/']), 500);
      },

      error: (err) => {
        this.showSnackbar('Signup failed', 'error');

        // const message = err?.error?.message || 'Signup failed';
        // if (message.toLowerCase().includes('email')) {
        //   this.email.setErrors({ emailTaken: true });
        // }
        // this.showSnackbar(message, 'error');
      },
    });
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
}
