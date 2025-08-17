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
    private currentUserSubject = new BehaviorSubject<string | null>(null);
    public currentUser = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {
        const token = localStorage.getItem('token');
        if (token && !this.jwtHelper.isTokenExpired(token)) {
            const decodedToken = this.jwtHelper.decodeToken(token);
            console.log('Decoded Token on init:', decodedToken); // برای دیباگ
            const username = decodedToken?.name || decodedToken?.sub || decodedToken?.username || decodedToken?.preferred_username || decodedToken?.email || null;
            this.currentUserSubject.next(username);
            console.log('Current Username on init:', username); // برای دیباگ
        } else {
            console.log('No valid token found on init');
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
                    const decodedToken = this.jwtHelper.decodeToken(response.token);
                    console.log('Decoded Token after login:', decodedToken); // برای دیباگ
                    const username = decodedToken?.name || decodedToken?.sub || decodedToken?.username || decodedToken?.preferred_username || decodedToken?.email || null;
                    this.currentUserSubject.next(username);
                    console.log('Current Username after login:', username); // برای دیباگ
                } else {
                    console.log('No token received in login response:', response);
                }
            })
        );
    }

    logout(): void {
        localStorage.removeItem('token');
        this.currentUserSubject.next(null);
        console.log('Logged out, currentUsername set to null');
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

    getCurrentUsername(): string | null {
        const token = localStorage.getItem('token');
        if (token && !this.jwtHelper.isTokenExpired(token)) {
            const decodedToken = this.jwtHelper.decodeToken(token);
            const username = decodedToken?.name || decodedToken?.sub || decodedToken?.username || decodedToken?.preferred_username || decodedToken?.email || null;
            console.log('getCurrentUsername:', username); // برای دیباگ
            return username;
        }
        return null;
    }
}
