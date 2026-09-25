import { Notas } from "./Notas";
import { Nota } from "./Nota";
import Formulario from "./Formulario";

export class Controlador{
    private notas: Notas;
    
    public constructor(notas: Notas){
        this.notas = notas;
    }

    public onCrearNota(titulo: string, texto: string, colorDeFondo: string, minutosDeValidez: number): void{
        const nota = new Nota(titulo, texto, colorDeFondo, minutosDeValidez);
        this.notas.push(nota);
    }

    public onEditar(id: number): void{
        const nota = this.notas.find(n => n.Id === id);
        Formulario();
    }
}