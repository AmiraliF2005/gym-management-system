import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClassService } from '../../services/class-service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Trainer } from '../../Models/trainer.model';
import { TrainerService } from '../../services/trainerService';
import { Class } from '../../Models/class.model';

@Component({
  selector: 'app-class-form',
  imports: [MatFormFieldModule, CommonModule, ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatCardModule],
  templateUrl: './class-form.html',
  styleUrl: './class-form.css'
})
export class ClassForm implements OnInit {
  classForm: FormGroup;
  trainers: Trainer[] = [];
  classId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private classService: ClassService,
    private trainerService: TrainerService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.classForm = this.fb.group({
      name: ['', Validators.required],
      trainerId: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1), Validators.pattern('^[0-9]+$')]],
      price: ['', [Validators.required, Validators.min(1), Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]]
    }, { validators: this.endTimeValidator });
  }

  ngOnInit(): void {
    this.trainerService.getTrainers().subscribe({
      next: (data: Trainer[]) => {
        this.trainers = data;
        console.log('Trainers loaded:', this.trainers);
      },
      error: err => {
        console.error('Error loading trainers:', err);
        alert('خطا در لود کردن مربیان');
      }
    });

    this.classId = this.route.snapshot.params['id'] ? +this.route.snapshot.params['id'] : null;
    if (this.classId) {
      this.classService.getById(this.classId).subscribe({
        next: (data: any) => {
          const price = Number(data.price);
          this.classForm.patchValue({
            name: data.name,
            trainerId: data.trainerId,
            startTime: new Date(data.startTime).toISOString().slice(0, 16),
            endTime: new Date(data.endTime).toISOString().slice(0, 16),
            capacity: Number(data.capacity),
            price: price
          });
        },
        error: err => {
          console.error('Error loading class:', err);
          alert('خطا در لود کردن دوره');
        }
      });
    }

    this.classForm.statusChanges.subscribe(status => {
      console.log('Form status:', status);
      console.log('Form errors:', this.classForm.errors);
      console.log('Form value:', this.classForm.value);
    });
  }

  endTimeValidator(form: FormGroup): { [key: string]: any } | null {
    const startTime = form.get('startTime')?.value;
    const endTime = form.get('endTime')?.value;
    if (startTime && endTime) {
      const start = new Date(startTime);
      const end = new Date(endTime);
      if (end <= start) {
        form.get('endTime')?.setErrors({ invalidEndTime: true });
        return { invalidEndTime: true };
      }
    }
    return null;
  }

  onSubmit(): void {
    if (this.classForm.invalid) {
      alert('لطفاً همه فیلدها را به درستی پر کنید');
      console.log('Invalid form:', this.classForm.errors);
      Object.keys(this.classForm.controls).forEach(key => {
        const controlErrors = this.classForm.get(key)?.errors;
        if (controlErrors) {
          console.log(`Errors in ${key}:`, controlErrors);
        }
      });
      return;
    }

    const startTime = this.classForm.value.startTime;
    const endTime = this.classForm.value.endTime;
    const price = Number(this.classForm.value.price);
    const capacity = +this.classForm.value.capacity;

    if (isNaN(price) || price < 1000) {
      alert('قیمت دوره باید حداقل 1000 باشد');
      this.classForm.get('price')?.setErrors({ minPrice: true });
      return;
    }

    if (isNaN(capacity) || capacity <= 0) {
      alert('ظرفیت دوره باید بیشتر از صفر باشد');
      this.classForm.get('capacity')?.setErrors({ minCapacity: true });
      return;
    }

    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      alert('لطفاً زمان شروع و پایان معتبر وارد کنید');
      return;
    }

    const selectedTrainer = this.trainers.find(t => t.id === +this.classForm.value.trainerId);
    if (!selectedTrainer) {
      alert('مربی انتخاب‌شده معتبر نیست');
      this.classForm.get('trainerId')?.setErrors({ invalidTrainer: true });
      return;
    }

    const formValue: Class = {
      id: this.classId || 0,
      name: this.classForm.value.name.trim(),
      trainerId: +this.classForm.value.trainerId,
      trainerName: selectedTrainer.name,
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
      capacity: capacity,
      price: price
    };

    console.log('Submitting form with value:', formValue);

    const request = this.classId
      ? this.classService.update(this.classId, formValue)
      : this.classService.create(formValue);

    request.subscribe({
      next: () => {
        alert(this.classId ? 'دوره با موفقیت ویرایش شد' : 'دوره با موفقیت ایجاد شد');
        this.router.navigate(['/classes']);
      },
      error: err => {
        console.error('Error saving class:', err);
        console.log('Error details:', err.error);
        alert(`خطا در ذخیره دوره: ${err.error?.Message || err.error || err.message}`);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/classes']);
  }
}
