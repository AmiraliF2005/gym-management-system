import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Trainer } from '../Models/trainer.model';

@Injectable({
  providedIn: 'root'
})
export class TrainerService {
  private apiUrl = 'https://localhost:7213/api/trainers';

  constructor(private http: HttpClient) { }

  getTrainers(): Observable<Trainer[]> {
    return this.http.get<Trainer[]>(this.apiUrl);
  }

  getTrainer(id: number): Observable<Trainer> {
    return this.http.get<Trainer>(`${this.apiUrl}/${id}`);
  }

  updateTrainer(trainerId: number, data: any): Observable<Trainer> {
    return this.http.put<Trainer>(`${this.apiUrl}/${trainerId}`, data).pipe(
      catchError(error => {
        console.error('خطا در ویرایش مربی:', error);
        return throwError(() => error);
      })
    );
  }

  deleteTrainer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addTrainer(trainer: any): Observable<any> {
    console.log('Sending to server:', trainer); // دیباگ
    return this.http.post(`${this.apiUrl}`, trainer).pipe(
      tap(response => console.log('Server response:', response)),
      catchError(error => {
        console.error('Server error:', error);
        return throwError(() => Error(error));
      })
    );
  }
}
