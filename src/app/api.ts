import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Api {
  private apiUrl = 'https://localhost:7213/api';

  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get<string[]>(`${this.apiUrl}/users`);
  }
}
