import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, UserDto } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, MatFormFieldModule, CommonModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatCardModule , CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const user: UserDto = this.registerForm.value;
      console.log('Sending registration data:', user);
      this.authService.register(user).subscribe({
        next: () => {
          alert('ثبت‌نام با موفقیت انجام شد');
          this.router.navigate(['/login']);
        },
        error: err => {
          console.error('Registration error:', err);
          alert(err.error?.title || err.error?.message || 'خطا در ثبت‌نام');
        }
      });
    } else {
      alert('لطفاً همه فیلدها را به درستی پر کنید');
    }
  }
}
