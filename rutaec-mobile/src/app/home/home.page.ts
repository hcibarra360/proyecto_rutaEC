import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { logOutOutline, personCircleOutline, busOutline } from 'ionicons/icons';
// Importación corregida a auth en lugar de auth.service
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class HomePage implements OnInit {
  private authService = inject(AuthService);
  user: any = null;

  constructor() {
    addIcons({ logOutOutline, personCircleOutline, busOutline });
  }

  ngOnInit() {
    this.user = this.authService.getUserData();
  }

  logout() {
    this.authService.logout();
  }
}