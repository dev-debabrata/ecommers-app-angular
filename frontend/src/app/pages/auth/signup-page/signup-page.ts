import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup-page',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './signup-page.html',
  styleUrl: './signup-page.css',
})
export class SignupPage {
  constructor(private router: Router) {}

  form = new FormGroup({
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

    passwords: new FormGroup({
      password: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(6)],
      }),

      confirmPassword: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    }),

    phones: new FormArray<FormControl<string>>([new FormControl('', { nonNullable: true })]),
  });

  onSubmit() {
    if (this.form.invalid) {
      console.log('INVALID FORM!');

      return;
    }

    localStorage.setItem('isLoggedIn', 'true');
    this.router.navigate(['/']);
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
