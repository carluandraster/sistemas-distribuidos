export class Nota{
    private id: number;
    private static idCounter: number = 0;
    private titulo: string;
    private texto: string;
    private colorDeFondo: string;
    private minutosDeValidez: number;

    public constructor(titulo: string, texto: string, colorDeFondo: string, minutosDeValidez: number){
        this.id = Nota.idCounter++;
        this.titulo = titulo;
        this.texto = texto;
        this.colorDeFondo = colorDeFondo;
        this.minutosDeValidez = minutosDeValidez;
    }

    public equals(obj: any): boolean {
        if (this === obj) {
            return true;
        }
        if (obj === null || obj === undefined) {
            return false;
        }
        if (this.constructor !== obj.constructor) {
            return false;
        }
        return this.id === obj.id;
    }
}