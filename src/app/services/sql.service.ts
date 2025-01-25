import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Device } from '@capacitor/device';
import { CapacitorSQLite, capSQLiteChanges, capSQLiteValues, JsonSQLite } from '@capacitor-community/sqlite';
import { Preferences } from '@capacitor/preferences';

@Injectable({
    providedIn: 'root'
})
export class SqlService {

    private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private isWeb: boolean = false;
    private nombreDb: string = 'data.db';

    constructor(
        private readonly http: HttpClient
    ) {

    }

    // ! ========================= OBTENCIÓN DE DATOS ======================== */

    // * ~~~~~~~~~~~~~~~~~~~~~ Nombre De La Base De Datos ~~~~~~~~~~~~~~~~~~~~ */
    public getnombreDb(): string {
        return this.nombreDb;
    }

    // * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Entorno ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    public getIsWeb(): boolean {
        return this.isWeb;
    }

    // * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ DB Ready ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    public getDbReady(): BehaviorSubject<boolean> {
        return this.dbReady;
    }

    // ! ===================== INICIALIZAR BASE DE DATOS ===================== */
    public async inicializarBaseDatos(): Promise<void> {

        console.log('Iniciando la base de datos');

        const info = await Device.getInfo();
        const sqlite = CapacitorSQLite as any;

        if (info.platform === 'web') {
            this.isWeb = true;
            await customElements.whenDefined('jeep-sqlite');
            console.log('jeep-sqlite listo');
            await sqlite.initWebStore();
        }

        await this.crearConexion();
    }

    // ! ======================== CREAMOS LA CONEXIÓN ======================== */
    async crearConexion() {
        const dbSetUp = await Preferences.get({ key: 'first_setup_key' });

        if (!dbSetUp.value) {
            await this.descargarBaseDatos();
        } else {
            await CapacitorSQLite.createConnection({ database: this.nombreDb });
            await CapacitorSQLite.open({ database: this.nombreDb });
            this.dbReady.next(true);
            this.crearTablaPublicaciones();
        }

    }

    // ! ========== CREAMOS LA TABLA QUE CONTIENE LAS PUBLICACIONES ========== */
    async crearTablaPublicaciones() {

        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS publicaciones (
            id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL,
            descripcion TEXT NOT NULL,
            fecha DATETIME NOT NULL,
            imagen TEXT NOT NULL
        );`;

        try {
            await CapacitorSQLite.open({ database: this.nombreDb });
            await CapacitorSQLite.execute({
                database: this.nombreDb,
                statements: createTableQuery
            });
            console.log('Tabla publicaciones creada o ya existe');
        } catch (error) {
            console.error('Error al crear la tabla publicaciones:', error);
        }

    }

    // ! ==================== DESCARGAMOS LA BASE DE DATOS =================== */
    descargarBaseDatos() {
        this.http.get<JsonSQLite>('/assets/db/db.json').subscribe(
            async (jsonExport) => {
                const jsonstring = JSON.stringify(jsonExport);
                console.log('JSON recibido:', jsonstring); // <-- Verificar si carga bien

                const isValid = await CapacitorSQLite.isJsonValid({ jsonstring });
                if (isValid.result) {
                    console.log('JSON válido, importando...');

                    await CapacitorSQLite.importFromJson({ jsonstring });
                    await CapacitorSQLite.createConnection({ database: this.nombreDb });
                    await CapacitorSQLite.open({ database: this.nombreDb });

                    console.log('Base de datos importada con éxito');

                    await Preferences.set({ key: 'first_setup_key', value: '1' });
                    await Preferences.set({ key: 'dbName', value: this.nombreDb });

                    this.dbReady.next(true);
                } else {
                    console.error('JSON de la base de datos no es válido');
                }
            },
            (error) => {
                console.error('Error al descargar el archivo JSON:', error);
            }
        );
    }

}