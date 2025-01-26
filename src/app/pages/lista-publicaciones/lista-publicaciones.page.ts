import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Device } from '@capacitor/device';
import { ViewWillEnter } from '@ionic/angular';
import {
  IonButton, IonCol, IonContent, IonFab, IonFabButton,
  IonGrid, IonHeader, IonIcon, IonItem, IonList,
  IonRow, IonTitle, IonToolbar, Platform
} from '@ionic/angular/standalone';
import { VerPublicacionComponent } from 'src/app/modals/ver-publicacion-modal/ver-publicacion-modal.component';
import { Publicacion } from 'src/app/models/publicacion.model';
import { FechaPipe } from 'src/app/pipes/fecha.pipe';
import { PublicacionService } from 'src/app/services/publicacion.service';
import { SqlService } from 'src/app/services/sql.service';

@Component({
  selector: 'app-lista-publicaciones',
  templateUrl: 'lista-publicaciones.page.html',
  styleUrls: ['lista-publicaciones.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonButton, CommonModule,
    IonGrid, IonRow, IonCol, IonIcon, IonFab, FechaPipe,
    IonFabButton, RouterModule, VerPublicacionComponent
  ]
})
export class ListaPublicaciones implements ViewWillEnter, OnInit {

  // & ======================= VARIABLES PARA LA BASE ====================== */
  public isWeb: boolean = false;
  public load: boolean = false;
  public yaInicializado: boolean = false;

  // & =========================== LISTA DE CITAS ========================== */
  public publicaciones: Publicacion[] = [];

  // & ================ MODAL PARA ELIMINAR UNA PUBLICACIÓN ================ */
  public publicacionSeleccionada!: Publicacion;

  constructor(
    private readonly sqlService: SqlService,
    private readonly publicacionService: PublicacionService,
    private readonly platform: Platform
  ) { }


  // ! ================== CUANDO VOLVEMOS A VER LA PÁGINA ================== */
  async ionViewWillEnter() {

    if (!this.yaInicializado) {
      this.yaInicializado = true;
      return;
    }
    this.buscarPublicacionesBddLista();
  }

  // ! ============================== INICIO! ============================== */
  async ngOnInit() {
    await this.iniciarBaseDatos();
  }


  // ! ================ MANDAMOS A INICIAR LA BASE DE DATOS ================ */
  async iniciarBaseDatos() {
    this.platform.ready().then(
      async () => {
        const info = await Device.getInfo();
        this.isWeb = info.platform == 'web';

        this.sqlService.inicializarBaseDatos();
        this.buscarPublicacionesBddLista();
      })
  }

  // ! ========== BUSCAMOS PUBLICACIONES CUANDO ESTÁ LISTA LA BDD ========== */
  async buscarPublicacionesBddLista() {
    this.sqlService.getDbReady().subscribe(
      async (load) => {
        if (load) {
          await this.buscarPublicaciones();
        }
        this.load = load;
      })
  }


  // ! ================= BUSCAMOS LA LISTA DE PUBLICACIONES ================ */
  async buscarPublicaciones() {

    try {

      this.publicaciones = await this.publicacionService.findAllPublicaciones();
      console.log('Citas cargadas', this.publicaciones);

    } catch (error) {
      console.log('Error al cargar las citas', error);
    }

  }

  // ! ===================== ELIMINAMOS UNA PUBLICACIÓN ==================== */
  async eliminarPublicacion(publicacion: Publicacion) {

    try {

      await this.publicacionService.eliminar(publicacion.id);
      console.log('Publicación eliminada');
      await this.buscarPublicaciones();

    } catch (error) {
      console.error('Error al eliminar la publicación', publicacion);
    }

  }

  // ! ============= FUNCIONES PARA EL MODAL DE LA ELIMINACIÓN ============= */
  abrirModalVerEliminar(publicacion: Publicacion) {
    this.publicacionSeleccionada = publicacion;
    document.getElementById('open-modal')?.click();
  }

  async eliminarYRecargar() {
    await this.publicacionService.eliminar(this.publicacionSeleccionada.id);
    console.log('Se ha eliminado una publicación. Recargando...');
    await this.buscarPublicaciones();
  }

}
