import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-ver-publicaciones',
  templateUrl: 'ver-publicaciones.page.html',
  styleUrls: ['ver-publicaciones.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})
export class VerPublicaciones {
  constructor() { }
}
