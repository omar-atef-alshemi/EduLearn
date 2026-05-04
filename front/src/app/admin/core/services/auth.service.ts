import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';

export interface AuthUser {
  _id: string;
  email: string;
  role: string;
  firstName: string;
  lastName?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private TOKEN_KEY = 'accessToken';
  private USER_KEY = 'user';

  private currentUserSubject =
    new BehaviorSubject<AuthUser | null>(this.loadUser());

  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  // ===== LOGIN =====
  login(data: any) {
    return this.http.post<any>(`http://localhost:5000/auth/login`, data).pipe(
      tap((res) => {

        const user: AuthUser = {
          _id: res.userId,
          email: res.email,
          role: res.role,
          firstName: res.firstName,
          lastName: ''
        };

        localStorage.setItem(this.TOKEN_KEY, res.accessToken);
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));

        this.currentUserSubject.next(user);
      })
    );
  }

  // ===== LOGOUT =====
  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/signin']);
  }

  // ===== CHECK =====
  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'admin';
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  get currentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  // ===== LOAD FROM STORAGE =====
  private loadUser(): AuthUser | null {
  const user = localStorage.getItem(this.USER_KEY);

  if (!user || user === 'undefined') {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch (e) {
    localStorage.removeItem(this.USER_KEY);
    return null;
  }
  }
}