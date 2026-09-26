import { setDefaultHighWaterMark } from "stream";
import { Nota } from "./Nota";

export const KEY = "notas";
/**
     * Representa una colección de notas en la aplicación.
     */
export class Notas extends Array<Nota> {
    
    
    public constructor() {
        super();
    }

    public override push(...notas: Nota[]): number {
        let nota: Nota;
        this.update();
        return super.push(...notas);
    }

    public override splice(index: number, deleteCount?: number): Nota[] {
        let resultado = super.splice(index, deleteCount);
        this.update();
        return resultado;
    }

    /**
     * Actualiza las notas en el almacenamiento local.
     * 
     * @returns void
     */
    public update(): void {
        localStorage.setItem(KEY, JSON.stringify(this));
    }

    /**
     * Modifica una nota existente en la colección de notas.
     * @param id - El id de la nota a modificar. Pre: debe existir una nota con este id en la colección de notas.
     * @param titulo - El nuevo título de la nota.
     * @param texto - El nuevo contenido de la nota.
     * @param colorDeFondo - El nuevo color de fondo de la nota.
     * @param minutosDeValidez - El nuevo tiempo en minutos que la nota es válida.
     * @returns void
     */
    public modificarNota(id: number, titulo: string, texto: string, colorDeFondo: string, minutosDeValidez: number): void {
        let nota = this.find(n => n.Id === id) as Nota;
        nota.Titulo = titulo;
        nota.Texto = texto;
        nota.ColorDeFondo = colorDeFondo;
        nota.MinutosDeValidez = minutosDeValidez;
        this.update();
    }
}