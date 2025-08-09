import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Class } from '../Models/class.model';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  private apiUrl = 'https://localhost:7213/api/class';

  constructor(private http: HttpClient) { }

  create(classData: Class): Observable<any> {
    return this.http.post(this.apiUrl, classData);
  }

  update(id: number, classData: Class): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, classData);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getAll(): Observable<Class[]> {
    return this.http.get<Class[]>(this.apiUrl);
  }

  getById(id: number): Observable<Class> {
    return this.http.get<Class>(`${this.apiUrl}/${id}`);
  }
}
