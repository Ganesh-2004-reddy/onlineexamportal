// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class Auth {

//   constructor() { }
// }

// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { Router } from '@angular/router';

// @Injectable({ providedIn: 'root' })
// export class AuthService {
//   private baseUrl = 'http://localhost:8080/examProtal/userModule';

//   constructor(private http: HttpClient, private router: Router) {}

//   register(user: any): Observable<any> {
//     return this.http.post(`${this.baseUrl}/register`, user);
//   }

//   login(user: any): Observable<any> {
//     return this.http.post(`${this.baseUrl}/login`, user);
//   }

//   storeToken(token: string) {
//     localStorage.setItem('token', token);
//   }

//   getToken(): string | null {
//     return localStorage.getItem('token');
//   }

//   decodeRoleFromToken(): string {
//     const token = this.getToken();
//     if (!token) return '';
//     const payload = JSON.parse(atob(token.split('.')[1]));
//     const role = payload.roles?.[0]?.replace('ROLE_', '') || '';
//     return role;
//   }

//   logout(): void {
//     localStorage.clear();
//     this.router.navigate(['/login']);
//   }
// }

// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';


// export interface LoginDTO {
//   email: string;
//   password: string;
// }

// export interface UserRegistrationDTO {
//   name: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
// }

// export interface UserDTO {
//   userId: number;
//   name: string;
//   email: string;
//   role: string;
//   token: string;
// }

// @Injectable({ providedIn: 'root' })
// export class AuthService {
//   private baseUrl = 'http://localhost:8080/examProtal/userModule';

//   constructor(private http: HttpClient) {}

//   login(loginDTO: LoginDTO): Observable<UserDTO> {
//     return this.http.post<UserDTO>(`${this.baseUrl}/login`, loginDTO);
//   }

//   register(user: UserRegistrationDTO): Observable<UserDTO> {
//     return this.http.post<UserDTO>(`${this.baseUrl}/register`, user);
//   }

//   getUserProfile(userId: number): Observable<any> {
//     return this.http.get<any>(`${this.baseUrl}/${userId}/profile`);
//   }

//   updateProfile(userId: number, user: UserRegistrationDTO): Observable<UserDTO> {
//     return this.http.put<UserDTO>(`${this.baseUrl}/${userId}`, user);
//   }

//   logout(): void {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//   }

//   saveUser(user: UserDTO): void {
//     localStorage.setItem('user', JSON.stringify(user));
//     localStorage.setItem('token', user.token);
//   }

//   getUser(): UserDTO | null {
//     const data = localStorage.getItem('user');
//     return data ? JSON.parse(data) : null;
//   }

//   getToken(): string | null {
//     return localStorage.getItem('token');
//   }
// }


import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';


export interface JwtPayload {
  sub: string;
  exp: number;
  roles: string[]; // assuming backend sends ["ROLE_ADMIN"], ["ROLE_STUDENT"], etc.
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8090/examPortal/userModule';

  constructor(private http: HttpClient, private router: Router) {}

  register(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('userId', res.userId);
        localStorage.setItem('role', res.role);
      })
    );
  }

  getProfile(): Observable<any> {
    const userId = localStorage.getItem('userId');
    return this.http.get(`${this.baseUrl}/${userId}/profile`);
  }

  updateProfile(updatedData: any): Observable<any> {
    const userId = localStorage.getItem('userId');
    return this.http.put(`${this.baseUrl}/${userId}`, updatedData);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  decodeToken(): any {
    const token = this.getToken();
    if (!token) return null;

    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  }

  getLoggedInUserId(): number | null {
    const decoded = this.decodeToken();
    return decoded ? +decoded.sub : null; // assuming 'sub' is userId or email
  }

  getLoggedInEmail(): string | null {
    const decoded = this.decodeToken();
    return decoded ? decoded.sub : null;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getRole(): string {
    return localStorage.getItem('role') || '';
  }

  decodeRoleFromToken(): string {
    const token = this.getToken();
    if (!token) return '';
    const payload = JSON.parse(atob(token.split('.')[1]));
    const role = payload.roles?.[0]?.replace('ROLE_', '') || '';
    return role;
  }
}
