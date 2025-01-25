export class Publicacion {

    public id: number = 0;
    public titulo: string = "";
    public descripcion: string = "";
    public fecha: Date = new Date();
    public imagen: string = "";

    constructor(fields?:
        {
            id?: number,
            titulo?: string,
            descripcion?: string,
            fecha?: Date,
            imagen?: string
        }
    ) {
        if (fields) {
            Object.assign(this, fields);
        }
    }

}