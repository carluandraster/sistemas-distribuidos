import { Nota } from "./Nota";

/**
     * Representa una colección de notas en la aplicación.
     */
export class Notas extends Array<Nota> {
    
    public constructor() {
        super();
    }

    public override push(...notas: Nota[]): number {
        let nota: Nota;
        for (nota of notas) {
            localStorage.setItem(`nota-${nota.Id}`, JSON.stringify(nota));
        }
        return super.push(...notas);
    }

    public override splice(index: number, deleteCount?: number): Nota[] {
        let nota: Nota;
        let i: number;
        for (i = index; i < index + (deleteCount || 0); i++) {
            nota = this[i];
            localStorage.removeItem(`nota-${nota.Id}`);
        }
        return super.splice(index, deleteCount);
    }
}