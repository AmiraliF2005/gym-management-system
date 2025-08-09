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
      capacity: ['', [Validators.required, Validators.min(1)]]
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
          this.classForm.patchValue({
            name: data.name,
            trainerId: data.trainerId,
            startTime: new Date(data.startTime).toISOString().slice(0, 16),
            endTime: new Date(data.endTime).toISOString().slice(0, 16),
            capacity: data.capacity
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
    if (this.classForm.valid) {
      const startTime = this.classForm.value.startTime;
      const endTime = this.classForm.value.endTime;

      const startDate = new Date(startTime);
      const endDate = new Date(endTime);
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        alert('لطفاً زمان شروع و پایان معتبر وارد کنید');
        return;
      }
      const selectedTrainer = this.trainers.find(t => t.id === +this.classForm.value.trainerId);
      if (!selectedTrainer) {
        alert('مربی انتخاب‌شده معتبر نیست');
        return;
      }
      const formValue: Class = {
        id: this.classId,
        name: this.classForm.value.name,
        trainerId: +this.classForm.value.trainerId,
        trainerName: selectedTrainer.name,
        startTime: new Date(this.classForm.value.startTime).toISOString(),
        endTime: new Date(this.classForm.value.endTime).toISOString(),
        capacity: +this.classForm.value.capacity
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
          alert(err.error?.title || err.error || 'خطایی در ذخیره دوره رخ داد');
        }
      });
    } else {
      alert('لطفاً همه فیلدها را به درستی پر کنید');
    }
  }

  onCancel(): void {
    this.router.navigate(['/classes']);
  }
}
