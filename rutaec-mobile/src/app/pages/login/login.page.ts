import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, RouterModule]
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    email: ['carlos@rutaec.com', [Validators.required, Validators.email]],
    password: ['123456', [Validators.required]]
  });

  errorMessage: string = '';

  onLogin() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (res: any) => {
          // Guardar el token y los datos del usuario en la sesión
          localStorage.setItem('token', res.token || 'jwt_simulated_token');
          localStorage.setItem('user', JSON.stringify(res.user));

          // Redirigir al Dashboard principal
          this.router.navigate(['/home']);
        },
        error: (err: any) => {
          this.errorMessage = err.error?.message || 'Credenciales incorrectas';
        }
      });
    }
  }
}