import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from '../../../node_modules/rxjs/dist/types';

@Injectable({
  providedIn: 'root'
})
export class Member {
  private apiUrl = 'https://localhost:7213/api/members';

  constructor(private http: HttpClient) { }

  getMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(this.apiUrl);
  }

  addMember(member: Member): Observable<Member> {
    return this.http.post<Member>(this.apiUrl, member);
  }
}
