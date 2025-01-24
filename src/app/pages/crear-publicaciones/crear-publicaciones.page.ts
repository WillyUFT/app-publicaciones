import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-crear-publicaciones',
  templateUrl: 'crear-publicaciones.page.html',
  styleUrls: ['crear-publicaciones.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})
export class CrearPublicaciones {
  constructor() { }
}
