import { Component, OnInit } from '@angular/core';
import { Device } from '@capacitor/device';
import { IonHeader, IonToolbar, IonTitle, IonContent, Platform } from '@ionic/angular/standalone';
import { Publicacion } from 'src/app/models/publicacion.model';
import { PublicacionService } from 'src/app/services/publicacion.service';
import { SqlService } from 'src/app/services/sql.service';

@Component({
  selector: 'app-ver-publicaciones',
  templateUrl: 'ver-publicaciones.page.html',
  styleUrls: ['ver-publicaciones.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent]
})
export class VerPublicaciones implements OnInit {

  // & ======================= VARIABLES PARA LA BASE ====================== */
  public isWeb: boolean = false;
  public load: boolean = false

  // & =========================== LISTA DE CITAS ========================== */
  public publicaciones: Publicacion[] = [];

  constructor(
    private sqlService: SqlService,
    private publicacionService: PublicacionService,
    private readonly platform: Platform
  ) { }

  // ! ============================== INICIO! ============================== */
  async ngOnInit() {
    await this.iniciarBaseDatos();
  }


  // ! ================ MANDAMOS A INICIAR LA BASE DE DATOS ================ */
  async iniciarBaseDatos() {
    await this.platform.ready();

    const info = await Device.getInfo();
    this.isWeb = info.platform === 'web';

    // Esperamos a que la base de datos esté lista antes de continuar
    await this.sqlService.inicializarBaseDatos();

    console.log('TERMINADOOO');

    this.sqlService.getDbReady().subscribe(async (load) => {
      if (load) {
        console.log('Base de datos lista, cargando publicaciones...');
        await this.buscarPublicaciones();
      }
      this.load = load;
    });
  }


  // ! ================= BUSCAMOS LA LISTA DE PUBLICACIONES ================ */
  async buscarPublicaciones() {

    try {
      this.publicaciones = await this.publicacionService.findAllPublicaciones();

      const publicacion1 = new Publicacion({
        titulo: "Se perdió un perrito",
        descripcion: "Se busca un perrito blanco con manchas negras en el sector centro.",
        fecha: new Date(),
        imagen: "https://peoresnada.com/perrito.jpg"
      });

      const publicacion2 = new Publicacion({
        titulo: "Documento encontrado",
        descripcion: "Se encontró una cédula de identidad a nombre de Juan Pérez.",
        fecha: new Date(),
        imagen: "https://peoresnada.com/ci.jpg"
      });

      const publicacion3 = new Publicacion({
        titulo: "Corte de luz programado",
        descripcion: "Mañana habrá un corte de luz de 9 AM a 12 PM en el sector norte.",
        fecha: new Date(),
        imagen: "https://peoresnada.com/corte-luz.jpg"
      });

      this.publicaciones.push(publicacion1, publicacion2, publicacion3);


      console.log('Citas cargadas', this.publicaciones);

    } catch (error) {
      console.log('Error al cargar las citas', error);
    }

  }

}
