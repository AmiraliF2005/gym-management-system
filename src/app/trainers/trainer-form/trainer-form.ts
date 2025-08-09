import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TrainerService } from '../../services/trainerService';
import { NgFor } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Trainer } from '../../Models/trainer.model';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-trainer-form',
  imports: [ RouterLink  ],
  templateUrl: './trainer-form.html',
  styleUrl: './trainer-form.css'
})
export class TrainerForm implements OnInit {
  trainers: Trainer[] = [];
  trainerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private trainerService: TrainerService
  ) {
    // مقداردهی اولیه FormGroup در constructor
    this.trainerForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      phone: ['', [Validators.required, Validators.pattern(/^09\d{9}$/)]],
      specialization: ['', Validators.required],
      schedule: ['']
    });
  }

  ngOnInit(): void {
    this.loadTrainers();
  }

  loadTrainers(): void {
    this.trainerService.getTrainers().subscribe({
      next: (data) => this.trainers = data,
      error: (err) => console.error('خطا در دریافت مربیان', err)
    });
  }

  deleteTrainer(id: number): void {
    if (confirm('آیا از حذف این مربی مطمئن هستید؟')) {
      this.trainerService.deleteTrainer(id).subscribe({
        next: () => {
          alert('مربی با موفقیت حذف شد');
          this.loadTrainers();
        },
        error: (err) => {
          console.error('خطا در حذف مربی:', err);
          alert('خطا در حذف مربی');
        }
      });
    }
  }

  onSubmit(): void {
    if (this.trainerForm.valid) {
      this.trainerService.addTrainer(this.trainerForm.value).subscribe({
        next: () => {
          alert('مربی جدید با موفقیت اضافه شد');
          this.trainerForm.reset();
          this.loadTrainers();
        },
        error: (err) => {
          console.error('خطا در افزودن مربی:', err);
        }
      });
    }
  }
}
