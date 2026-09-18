import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { addIcons } from 'ionicons';
import { alertCircleOutline } from 'ionicons/icons';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    IonicModule, 
    HttpClientModule,
    RouterModule
  ]
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {
    addIcons({ alertCircleOutline });
  }

  ngOnInit() {}

  validarEmail(correo: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(correo);
  }

  onLogin() {
    this.errorMessage = '';

    if (!this.email.trim() || !this.password.trim()) {
      this.errorMessage = 'Por favor, ingrese su correo y contraseña.';
      return;
    }

    if (!this.validarEmail(this.email.trim())) {
      this.errorMessage = 'El formato del correo electrónico no es válido. Ej: usuario@ejemplo.com';
      return;
    }

    const body = { 
      email: this.email.trim(), 
      password: this.password.trim() 
    };

    // Petición HTTP POST utilizando la URL del entorno (192.168.1.14:3000)
    this.http.post(`${environment.apiBaseUrl}/auth/login`, body).subscribe({
      next: (res: any) => {
        // Guarda sesión del usuario en el almacenamiento local del dispositivo
        localStorage.setItem('user', JSON.stringify(res.user));
        localStorage.setItem('token', res.token);
        
        // Redirige al Dashboard/Home
        this.router.navigate(['/home']);
      },
      error: (err) => {
        if (err.status === 400) {
          this.errorMessage = 'Correo o contraseña incorrectos.';
        } else if (err.status === 0 || err.status === 500) {
          this.errorMessage = 'No se pudo conectar con el servidor. Verifique si backend está activo.';
        } else {
          this.errorMessage = 'Ocurrió un error inesperado. Intente nuevamente.';
        }
      }
    });
  }
}