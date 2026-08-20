import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, 
  IonList, IonItem, IonLabel 
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent, 
    IonList, IonItem, IonLabel
  ],
})
export class HomePage implements OnInit {
  rutas: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
this.http.get<any[]>('http://localhost:3000/api/v1/routes/popular')
      .subscribe({
        next: (data) => {
          this.rutas = data;
        },
        error: (err) => console.error('Error al conectar con la API:', err)
      });
  }
}