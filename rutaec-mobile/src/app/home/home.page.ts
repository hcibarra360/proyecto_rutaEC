import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { 
  locationOutline, 
  cameraOutline, 
  busOutline, 
  mapOutline, 
  cubeOutline, 
  logOutOutline 
} from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class HomePage implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  
  usuario: any = null;
  fotoUrl: string | null = null;

  constructor(
    private toastCtrl: ToastController,
    private router: Router
  ) {
    addIcons({ 
      locationOutline, 
      cameraOutline, 
      busOutline, 
      mapOutline, 
      cubeOutline, 
      logOutOutline 
    });
  }

  ngOnInit() {
    const userString = localStorage.getItem('user');
    if (userString) {
      this.usuario = JSON.parse(userString);
    }
  }

  // -------------------------------------------------------------
  // UBICACIÓN (GPS WEB)
  // -------------------------------------------------------------
  obtenerUbicacionWeb() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          this.mostrarToast(`Ubicación: Lat ${lat.toFixed(4)}, Lng ${lng.toFixed(4)}`, 'success');
        },
        (error) => {
          console.error(error);
          this.mostrarToast('Activa el GPS de tu teléfono.', 'danger');
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      this.mostrarToast('Geolocalización no soportada.', 'danger');
    }
  }

  // -------------------------------------------------------------
  // CÁMARA (INPUT NATIVO ANDROID)
  // -------------------------------------------------------------
  abrirCamaraWeb() {
    if (this.fileInput) {
      this.fileInput.nativeElement.click();
    }
  }

  onFotoCapturada(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fotoUrl = URL.createObjectURL(file);
      this.mostrarToast('Foto capturada con éxito', 'success');
    }
  }

  // -------------------------------------------------------------
  // CERRAR SESIÓN
  // -------------------------------------------------------------
  cerrarSesion() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      color: color,
      position: 'bottom'
    });
    toast.present();
  }
}