import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
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
import { delay, map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule, RouterLink, ReactiveFormsModule, CommonModule, MatIconModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  private router = inject(Router);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  form = new FormGroup({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.email, Validators.required],
      asyncValidators: [this.checkEmailExists()],
      updateOn: 'blur',
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });

  checkEmailExists() {
    return (control: AbstractControl) => {
      if (!control.value) return of(null);

      return this.authService.login(control.value).pipe(
        delay(500),
        map((users: any[]) => (users.length === 0 ? { emailNotRegistered: true } : null)),
      );
    };
  }
  // checkEmailExists(): AsyncValidatorFn {
  //   return (control: AbstractControl): Observable<ValidationErrors | null> => {
  //     if (!control.value) return of(null);

  //     return this.authService.checkEmail(control.value).pipe(
  //       delay(500),
  //       map((users: any[]) => {
  //         return users.length === 0 ? { emailNotRegistered: true } : null;
  //       }),
  //     );
  //   };
  // }

  get email() {
    return this.form.controls.email;
  }

  get password() {
    return this.form.controls.password;
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
      this.showSnackbar('Please enter valid email and password', 'error');
      return;
    }

    // const data = this.form.getRawValue();

    // this.authService.checkEmail(data.email).subscribe({
    const data = this.form.value;

    this.authService.login(data.email!).subscribe({
      next: (users) => {
        if (users.length === 0) {
          this.email.setErrors({ emailNotRegistered: true });
          this.showSnackbar('Email not registered', 'error');
          return;
        }

        if (users[0].password !== data.password) {
          this.password.setErrors({ invalidPassword: true });
          this.showSnackbar('Invalid password', 'error');
          return;
        }
        // if (!users || users.length === 0) {
        //   this.email.setErrors({ emailNotRegistered: true });
        //   this.showSnackbar('Email not registered', 'error');
        //   return;
        // }

        // const user = users[0];

        // if (user.password !== data.password) {
        //   this.password.setErrors({ invalidPassword: true });
        //   this.showSnackbar('Invalid password', 'error');
        //   return;
        // }

        this.email.setErrors(null);
        this.password.setErrors(null);

        this.authService.setToken('fake-token');
        this.showSnackbar('Login successful', 'success');
        this.router.navigate(['/']);
      },

      error: () => {
        this.showSnackbar('Something went wrong', 'error');
      },
    });
  }
}
