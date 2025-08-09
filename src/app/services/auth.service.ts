import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

export interface UserDto {
  username: string;
  password: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7213/api/auth';
  private currentUserSubject = new BehaviorSubject<string | null>(null)
  public currentUser = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {
    const token = localStorage.getItem('token');
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      this.currentUserSubject.next(this.jwtHelper.decodeToken(token)?.name || null);
    }
  }

  register(user: UserDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(user: UserDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, user).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          this.currentUserSubject.next(this.jwtHelper.decodeToken(response.token)?.name || null);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token && !this.jwtHelper.isTokenExpired(token);
  }

  getCurrentUserId(): number | null {
    const token = localStorage.getItem('token');
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return +this.jwtHelper.decodeToken(token)?.nameid || null;
    }
    return null;
  }
}
