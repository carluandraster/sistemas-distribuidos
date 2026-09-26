import { Notas } from "./Notas";
import { Nota } from "./Nota";

/**
 * Representa el controlador de la aplicación, que maneja la lógica de negocio y la interacción con el almacenamiento local.
 * 
 * # Propiedades
 * - `notas`: Arreglo de notas que se manejan en la aplicación.
 * 
 * # Métodos
 * - `onCrearNota(titulo: string, texto: string, colorDeFondo: string, minutosDeValidez: number): void`: Crea una nueva nota y la agrega al arreglo de notas.
 * - `onEditarNota(id: number, titulo: string, texto: string, colorDeFondo: string, minutosDeValidez: number): void`: Modifica una nota existente en el arreglo de notas.
 * 
 * # Constructores
 * - `constructor(notas: Notas)`: Crea una nueva instancia del controlador con el arreglo de notas proporcionado.
 */
export class Controlador{
    private static instancia: Controlador | null = null;
    private notas: Notas;
    
    private constructor(notas: Notas){
        this.notas = notas;
    }

    public static getInstance(notas: Notas | null = null): Controlador{
        if(this.instancia == null){
            this.instancia = new Controlador(notas as Notas);
        }
        return this.instancia;
    }

    /**
     * Función que se dispara cuando se clickea en el boton de formulario para crear una nueva nota.
     * @param titulo - El título de la nueva nota.
     * @param texto - El contenido de la nueva nota.
     * @param colorDeFondo - El color de fondo de la nueva nota.
     * @param minutosDeValidez - El tiempo en minutos que la nota es válida.
     * 
     * @returns void
     */
    public onCrearNota(titulo: string, texto: string, colorDeFondo: string, minutosDeValidez: number): void{
        const nota = new Nota(titulo, texto, colorDeFondo, minutosDeValidez);
        this.notas.push(nota);
    }

    /**
     * Función que se dispara cuando se clickea en el boton de formulario para modificar una nota. Actualiza los valores de la nota correspondiente en el arreglo de notas.
     * @param id - El id de la nota a modificar. Pre: debe existir una nota con este id en el arreglo de notas.
     * @param titulo - El nuevo título de la nota.
     * @param texto - El nuevo contenido de la nota.
     * @param colorDeFondo - El nuevo color de fondo de la nota.
     * @param minutosDeValidez - El nuevo tiempo en minutos que la nota es válida.
     * 
     * @returns void
     */
    public onEditarNota(id: number, titulo: string, texto: string, colorDeFondo: string, minutosDeValidez: number): void{
        this.notas.modificarNota(id, titulo, texto, colorDeFondo, minutosDeValidez);
    }

    /**
     * Función que se dispara cuando se clickea en el botón de eliminar nota.
     * @param id - El id de la nota a eliminar. Pre: debe existir una nota con este id en el arreglo de notas.
     * 
     * @returns void
     */
    public onEliminarNota(id: number): void{
        const index = this.notas.findIndex(n => n.Id === id);
        this.notas.splice(index, 1);
    }
}