import { Component, inject } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TrainerService } from '../../services/trainerService';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-add-trainer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule ],
  templateUrl: './add-trainer.html',
  styleUrls: ['./add-trainer.css']  // اصلاح styleUrl به styleUrls
})
export class AddTrainer {
  private fb = inject(FormBuilder);
  private trainerService = inject(TrainerService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  isLoading = false;

  trainerForm = this.fb.group({
    name: ['', [
      Validators.required,
      Validators.maxLength(100)
    ]],
    phone: ['', [
      Validators.required,
      Validators.pattern(/^09[0-9]{9}$/),
      Validators.maxLength(11)
    ]],
    specialization: ['', Validators.required],
    schedule: ['' ,  Validators.required]
  });

  async onSubmit(): Promise<void> {
  console.log('Submitting form...'); // برای دیباگ
  
  if (this.trainerForm.invalid) {
    console.warn('Form is invalid!', this.trainerForm.errors);
    this.markFormAsTouched();
    this.logFormErrors(); 
    return;
  }

  this.isLoading = true;
  
  try {
    const formData = {
      name: this.trainerForm.value.name!,
      phone: this.trainerForm.value.phone!,
      specialization: this.trainerForm.value.specialization!,
      schedule: this.trainerForm.value.schedule || null
    };

    console.log('Submitting:', formData); // دیباگ داده‌ها
    
    await firstValueFrom(this.trainerService.addTrainer(formData));
    
    this.snackBar.open('مربی با موفقیت ثبت شد', 'باشه', { duration: 3000 });
    this.router.navigate(['/trainers']);
  } catch (error) {
    console.error('Submission error:', error);
    this.snackBar.open('خطا در ثبت مربی', 'بستن', { duration: 5000 });
  } finally {
    this.isLoading = false;
  }
}

  private logFormErrors() {
  Object.keys(this.trainerForm.controls).forEach(key => {
    const control = this.trainerForm.get(key);
    if (control?.errors) {
      console.error(`Control ${key} has errors:`, control.errors);
    }
  });
}

  private markFormAsTouched() {
  this.markAbstractControlAsTouched(this.trainerForm);
}

private markAbstractControlAsTouched(control: AbstractControl) {
  if (control instanceof FormControl) {
    control.markAsTouched({ onlySelf: true });
  } else if (control instanceof FormGroup) {
    Object.values(control.controls).forEach(ctrl => this.markAbstractControlAsTouched(ctrl));
  } else if (control instanceof FormArray) {
    control.controls.forEach(ctrl => this.markAbstractControlAsTouched(ctrl));
  }
}

  private showSuccess(message: string) {
    this.snackBar.open(message, 'باشه', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string) {
    this.snackBar.open(message, 'بستن', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}
