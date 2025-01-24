import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Device } from '@capacitor/device';


@Injectable({
    providedIn: 'root'
})
export class SqlService {

    public dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public isWeb: boolean = false;
    public nombreDb: string = 'data.db';
    public contador = 0;

    constructor(
        private readonly http: HttpClient
    ) {

    }

    // ! ===================== INICIALIZAR BASE DE DATOS ===================== */
    public async inicializarBaseDatos() {

        console.log('Iniciando la base de datos');

        const info = await Device.getInfo();
        const sqlite = CapacitorSQLite as any;

        if (info.platform == 'web') {
            this.isWeb = true;

            // *  Nos aseguramos que el jeep-sqlite esté definido
            await customElements.whenDefined('jeep-sqlite');
            console.log('jeep-sqlite listo');

            await sqlite.initWebStore();
            console.log('webStore inicializado');
        }

        this.crearConexion();

    }

    async crearConexion() {

        const dbSetUp = await Preferences.get({ key: 'first_setup_key' });

        if (!dbSetUp.value) {
            this.descargarBaseDatos();
        } else {
            await CapacitorSQLite.createConnection({ database: this.nombreDb });
            await CapacitorSQLite.open({ database: this.nombreDb });
            this.dbReady.next(true);

            this.crearTablacitas();

        }

    }


}