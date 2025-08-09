import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TrainerService } from '../../services/trainerService';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, switchMap, take } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-trainer',
  imports: [ReactiveFormsModule ,MatFormFieldModule, CommonModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatCardModule],
  templateUrl: './edit-trainer.html',
  styleUrl: './edit-trainer.css'
})
export class EditTrainer implements OnInit {
  trainerForm!: FormGroup;
  isLoading = false;
  isEditing = false;
  specializations = [
    { value: 'bodybuilding', display: 'بدنسازی' },
    { value: 'yoga', display: 'یوگا' },
    { value: 'pilates', display: 'پیلاتس' },
    { value: 'crossfit', display: 'کراس فیت' }
  ];

  constructor(
    private fb: FormBuilder,
    private trainerService: TrainerService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadTrainerData();
  }

  initializeForm(): void {
    this.trainerForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [
        Validators.required,
        Validators.pattern(/^09\d{9}$/),
        Validators.maxLength(11)
      ]],
      specialization: ['', Validators.required],
      schedule: ['']
    });
  }

  loadTrainerData(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (!id) return of(null);
        this.isEditing = true;
        return this.trainerService.getTrainer(+id);
      })
    ).subscribe({
      next: (trainer) => {
        if (trainer) {
          this.trainerForm.patchValue({
            name: trainer.name,
            phone: trainer.phone,
            specialization: trainer.specialization,
            schedule: trainer.schedule || ''
          });
        }
      },
      error: (err) => {
        console.error('خطا در دریافت داده‌های مربی:', err);
        this.snackBar.open('خطا در دریافت اطلاعات', 'بستن', { duration: 3000 });
      }
    });
  }

  onSubmit(): void {
    if (this.trainerForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formData = this.trainerForm.value;

    this.route.paramMap.pipe(
      take(1),
      switchMap(params => {
        const id = params.get('id');
        return id ? this.trainerService.updateTrainer(+id, formData) : of(null);
      })
    ).subscribe({
      next: () => {
        this.snackBar.open('تغییرات با موفقیت ذخیره شد', 'باشه', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/trainer-form']);
      },
      error: (err) => {
        console.error('خطا در ویرایش:', err);
        this.snackBar.open('خطا در ذخیره تغییرات', 'بستن', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      },
      complete: () => this.isLoading = false
    });
  }

  private markAllAsTouched(): void {
    Object.values(this.trainerForm.controls).forEach(control => {
      control.markAsTouched();
    });
    this.snackBar.open('لطفا تمام فیلدهای الزامی را پر کنید', 'متوجه شدم', {
      duration: 5000
    });
  }

  onCancel(): void {
    if (this.trainerForm.dirty) {
      if (confirm('آیا از لغو تغییرات مطمئنید؟ تغییرات ذخیره نخواهند شد.')) {
        this.router.navigate(['/trainer-form']);
      }
    } else {
      this.router.navigate(['/trainer-form']);
    }
  }
}
