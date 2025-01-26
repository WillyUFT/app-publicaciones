import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Publicacion } from 'src/app/models/publicacion.model';
import {
  IonHeader, IonButtons, IonTitle, IonToolbar,
  IonButton, IonContent, IonModal, IonRow,
  IonCol
} from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { FechaPipe } from 'src/app/pipes/fecha.pipe';

@Component({
  selector: 'app-eliminar-publicacion-modal',
  templateUrl: './eliminar-publicacion-modal.component.html',
  styleUrls: ['./eliminar-publicacion-modal.component.scss'],
  standalone: true,
  imports: [IonModal, IonHeader, IonButtons,
    IonTitle, IonToolbar, IonButton,
    IonContent, CommonModule, IonRow,
    IonCol, FechaPipe
  ]
})
export class EliminarPublicacionComponent {

  @ViewChild(IonModal) modal!: IonModal;
  @Input() publicacion!: Publicacion;
  @Output() publicacionEliminada = new EventEmitter<void>();

  volver() {
    this.modal.dismiss(null, 'cancel');
  }

  confirmar() {
    this.publicacionEliminada.emit();
    this.modal.dismiss(this.publicacion, 'confirm');
  }

  onWillDismiss(event: CustomEvent) {
    if (event.detail.role === 'confirm') {
      console.log('Publicación eliminada:', this.publicacion.titulo);
    } else {
      console.log('Eliminación cancelada');
    }
  }
}


