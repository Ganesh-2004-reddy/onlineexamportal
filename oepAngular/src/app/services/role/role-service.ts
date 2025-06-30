// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class RoleService {

//   constructor() { }
// }

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private baseUrl = 'http://localhost:8090/api';
  private baseUrl2 = 'http://localhost:8090/examPortal/userModule';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl2}/users`);
  }

  updateUserRole(userId: number, newRole: string): Observable<void> {
    const params = new HttpParams().set('role', newRole);
    return this.http.put<void>(`${this.baseUrl}/admin/users/${userId}/role`, null, { params });
  }
  
}  

