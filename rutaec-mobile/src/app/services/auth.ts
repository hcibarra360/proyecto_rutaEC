import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:3000/api/v1/auth';

  // Obtener Token (requerido por auth-guard)
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Inicio de Sesión
  login(credentials: { email: string; password: string }) {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials);
  }

  // Registro de usuario
  register(data: any) {
    return this.http.post<any>(`${this.apiUrl}/register`, data);
  }

  // Datos guardados del usuario
  getUserData() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  // Cerrar Sesión
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}