/**
     * Representa una nota en la aplicación.
     * 
     * # Propiedades
     * - `id`: Identificador único de la nota.
     * - `titulo`: Título de la nota.
     * - `texto`: Contenido de la nota.
     * - `colorDeFondo`: Color de fondo de la nota.
     * - `minutosDeValidez`: Tiempo en minutos que la nota es válida.
     * 
     * # Métodos
     * - `equals(obj: any): boolean`: Compara la nota actual con otro objeto para determinar si son iguales.
     * 
     * # Constructores
     * - `constructor(titulo: string, texto: string, colorDeFondo: string, minutosDeValidez: number)`: Crea una nueva instancia de la clase Nota con los valores proporcionados.
*/
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

    public get Id(): number {
        return this.id;
    }

    public get Titulo(): string {
        return this.titulo;
    }

    public get Texto(): string {
        return this.texto;
    }

    public get ColorDeFondo(): string {
        return this.colorDeFondo;
    }

    public get MinutosDeValidez(): number {
        return this.minutosDeValidez;
    }

    public set Titulo(titulo: string) {
        this.titulo = titulo;
    }

    public set Texto(texto: string) {
        this.texto = texto;
    }

    public set ColorDeFondo(colorDeFondo: string) {
        this.colorDeFondo = colorDeFondo;
    }

    public set MinutosDeValidez(minutosDeValidez: number) {
        this.minutosDeValidez = minutosDeValidez;
    }
}