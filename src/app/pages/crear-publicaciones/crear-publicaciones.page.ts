import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonBackButton, IonButton, IonButtons, IonContent, IonHeader,
  IonInput, IonItem, IonLabel, IonNote, IonTitle, IonToolbar,
  IonIcon
} from '@ionic/angular/standalone';
import { mostrarToast } from 'src/app/Util/toast-service';
import { Publicacion } from './../../models/publicacion.model';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { PublicacionService } from 'src/app/services/publicacion.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-crear-publicaciones',
  templateUrl: 'crear-publicaciones.page.html',
  styleUrls: ['crear-publicaciones.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent,
    IonButtons, IonBackButton, IonItem,
    IonButton, CommonModule, ReactiveFormsModule,
    IonInput, IonItem, IonButton, IonNote, IonLabel,
    IonIcon
  ]
})
export class CrearPublicaciones {

  // * Definimos el formulario
  public publicacionForm: FormGroup;

  // * Imagen en base64
  imagen: string = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly publicacionService: PublicacionService,
    private readonly navCtrl: NavController
  ) {
    // & Configuración del formulario y sus validaciones
    this.publicacionForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(5)]],
      descripcion: ['', [Validators.required, Validators.minLength(20)]]
    });
  }

  // & Función que emite el evento para agregar la publicación en la BDD
  async agregar() {

    // * Validamos si el formulario es válido y exista la foto
    if (this.publicacionForm.valid && this.imagen != '') {

      // * Armamos el objeto publicación
      const publicacion: Publicacion = {
        id: 0,
        titulo: this.controlador('titulo')?.value,
        descripcion: this.controlador('descripcion')?.value,
        imagen: this.imagen,
        fecha: new Date()
      };

      await this.publicacionService.insertar(publicacion);

      // * Reiniciamos el formulario y la imagen vuelve
      // * a ser un string vacío
      this.publicacionForm.reset();
      this.imagen = '';

      // * Volver a /lista-publicaciones
      this.navCtrl.navigateRoot('/lista-publicaciones')

    } else {
      this.publicacionForm.markAllAsTouched();
      await mostrarToast('Por favor, complete todos los campos completamente', 'danger');
    }

  }

  // & Función para abrir la cámara o galería
  async tomarFoto() {
    try {

      // * Creamos el string para la cámara
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Prompt,
      });

      this.imagen = `data:image/jpeg;base64,${image.base64String}`;

    } catch (error) {
      console.error('Error al tomar la foto:', error);
    }
  }

  // & Función para obtener el controlador
  controlador(campo: string) {
    return this.publicacionForm.get(campo);
  }

}
