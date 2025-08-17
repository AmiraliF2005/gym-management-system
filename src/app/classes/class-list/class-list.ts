import { Component, Injector, OnInit } from '@angular/core';
import { Class } from '../../Models/class.model';
import { ClassService } from '../../services/class-service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-class-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './class-list.html',
  styleUrl: './class-list.css'
})
export class ClassList implements OnInit {
  classes: Class[] = [];
  isAuthenticated: boolean = false;
  private authService!: AuthService;

  constructor(
    private classService: ClassService,
    private http: HttpClient,
    private router: Router,
    private injector: Injector
  ) { }

  ngOnInit(): void {
    this.authService = this.injector.get(AuthService);
    this.loadClasses();
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  loadClasses(): void {
    this.classService.getAll().subscribe({
      next: (data: Class[]) => {
        this.classes = data;
        console.log('Classes loaded:', this.classes);
      },
      error: err => {
        console.error('Error loading classes:', err);
        alert('خطا در لود کردن دوره‌ها');
      }
    });
  }

  editClass(id: number): void {
    this.router.navigate(['/class-form', id]);
  }

  deleteClass(id: number): void {
    if (confirm('آیا مطمئن هستید که می‌خواهید این دوره را حذف کنید؟')) {
      this.classService.delete(id).subscribe({
        next: () => {
          alert('دوره با موفقیت حذف شد');
          this.loadClasses();
        },
        error: err => {
          console.error('Error deleting class:', err);
          alert(err.error?.title || 'خطا در حذف دوره');
        }
      });
    }
  }

  registerClass(id: number): void {
    if (!this.authService.isAuthenticated()) {
      alert('لطفاً ابتدا وارد شوید');
      this.router.navigate(['/login']);
      return;
    }

    this.http.post('https://localhost:7213/api/classRegistration', id).subscribe({
      next: () => {
        alert(`ثبت‌نام برای دوره با شناسه ${id} انجام شد`);
        this.router.navigate(['/payment']);
      },
      error: err => {
        console.error('Registration error:', err);
        alert(err.error?.message || 'خطا در ثبت‌نام برای دوره');
      }
    });
  }
}
