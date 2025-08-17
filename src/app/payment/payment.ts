import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';

interface ClassRegistration {
  id: number;
  classId: number;
  className: string;
  price: number;
}

@Component({
  selector: 'app-payment',
  imports: [CommonModule, RouterModule, MatButtonModule, MatCardModule, MatInputModule, FormsModule],
  templateUrl: './payment.html',
  styleUrl: './payment.css'
})
export class Payment implements OnInit {
  registrations: ClassRegistration[] = [];
  totalPrice: number = 0;
  cardNumber: string = '';
  cardHolderName: string = '';
  expiryDate: string = '';
  cvv: string = '';
  constructor(private http: HttpClient, private authService: AuthService) { }

  ngOnInit(): void {
    this.loadRegistrations();
  }

  loadRegistrations(): void {
    this.http.get<ClassRegistration[]>('https://localhost:7213/api/ClassRegistration/user-registrations')
      .subscribe({
        next: (data) => {
          this.registrations = data;
          this.calculateTotal();
          console.log('Registrations loaded:', data);
        },
        error: (err) => console.error('Error loading registrations:', err)
      });
  }

  deleteRegistration(id: number): void {
    this.http.delete(`https://localhost:7213/api/ClassRegistration/${id}`)
      .subscribe({
        next: () => {
          this.registrations = this.registrations.filter(r => r.id !== id);
          this.calculateTotal();
          console.log('Registration deleted:', id);
        },
        error: (err) => console.error('Error deleting registration:', err)
      });
  }

  calculateTotal(): void {
    this.totalPrice = this.registrations.reduce((sum, reg) => sum + reg.price, 0);
  }

  processPayment(): void {
    const paymentRequest = {
      cardNumber: this.cardNumber,
      cardHolderName: this.cardHolderName,
      expiryDate: this.expiryDate,
      cvv: this.cvv
    };
    this.http.post('https://localhost:7213/api/ClassRegistration/process-payment', paymentRequest)
      .subscribe({
        next: (response) => {
          console.log('Payment processed:', response);
          alert('پرداخت با موفقیت انجام شد!');
          this.registrations = [];
          this.totalPrice = 0;
          this.cardNumber = '';
          this.cardHolderName = '';
          this.expiryDate = '';
          this.cvv = '';
        },
        error: (err) => console.error('Error processing payment:', err)
      });
  }


}
