import { CapacitorSQLite, capSQLiteChanges, capSQLiteValues, JsonSQLite } from '@capacitor-community/sqlite';
import { SqlService } from './sql.service';
import { Publicacion } from '../models/publicacion.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PublicacionService {

  constructor(
    private readonly sqlService: SqlService
  ) {

  }

  // ! ======================= VER LAS PUBLICACIONES ======================= */
  async findAllPublicaciones() {

    let query = 'SELECT * FROM publicaciones;';

    try {

      const result: capSQLiteValues = await CapacitorSQLite.query({
        database: this.sqlService.getnombreDb(),
        statement: query
      });

      if (result.values) {
        return result.values;
      } else {
        return [];
      }

    } catch (error) {
      console.error('Error al obtener las publicacions:', error);
      return Promise.reject(error);
    }

  }

  // ! ====================== INSERTAR UNA PUBLICACIÓN ===================== */
  async insertar(publicacion: Publicacion) {

    const query = `INSERT INTO publicaciones
            (titulo, descripcion, fecha, imagen)
            VALUES (?, ?, ?, ?)`;

    // * Formateamos la fecha para que a SQLite no le de ansiedad
    const fechaFormateada = new Date(publicacion.fecha)
      .toISOString()
      .replace('T', ' ')
      .split('.')[0];

    const valores = [
      publicacion.titulo,
      publicacion.descripcion,
      fechaFormateada,
      publicacion.imagen
    ];

    try {

      const changes: capSQLiteChanges = await CapacitorSQLite.executeSet({
        database: this.sqlService.getnombreDb(),
        set: [{ statement: query, values: valores }]
      });

      if (this.sqlService.getIsWeb()) {
        await CapacitorSQLite.saveToStore({ database: this.sqlService.getnombreDb() });
      }
      await this.findAllPublicaciones();
      return changes;

    } catch (error) {
      console.error('Error al insertar publicacions: ', error);
      return Promise.reject(error);
    }

  }

  // ! ====================== ELIMINAR UNA PUBLICACIÓN ===================== */
  async eliminar(id: number): Promise<capSQLiteChanges> {

    const query = 'DELETE FROM publicaciones WHERE id = ?';
    const valores = [id];

    try {
      const changes: capSQLiteChanges = await CapacitorSQLite.executeSet({
        database: this.sqlService.getnombreDb(),
        set: [{ statement: query, values: valores }],
      });

      if (this.sqlService.getIsWeb()) {
        await CapacitorSQLite.saveToStore({ database: this.sqlService.getnombreDb() });
      }

      return changes;

    } catch (error) {
      console.error('Error al eliminar la publicación:', error);
      return Promise.reject(error);
    }
  }


}
