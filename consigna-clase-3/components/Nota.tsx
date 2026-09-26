import Formulario from "./Formulario";;
import { Pencil, Trash2 } from 'lucide-react';
import { Note } from "../lib/Notas";

export interface PropsNota{
    nota: Note;
    seleccionada: boolean;
    onEditar: (nota: Note) => void;
    onEliminar: (id: number) => void;
}

export function Nota(props: PropsNota) {
    return (
        <div
            className="nota rounded-2xl border border-white/30 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            style={{ backgroundColor: props.nota.color }}
        >
            <h2 className="mb-3 text-xl font-bold tracking-tight text-slate-900">
                {props.nota.title}
            </h2>
            <p className="leading-relaxed text-slate-800">{props.nota.text}</p>
            // Botones para modificar y eliminar la nota
            <div className="mt-4 flex justify-end gap-2">
                <button onClick={() => { props.onEditar(props.nota); }}>
                    <Pencil className="h-6 w-6 text-slate-900" />
                </button>
                <button onClick={() => {
                    if(window.confirm("¿Estás seguro de que deseas eliminar esta nota?"))
                        props.onEliminar(props.nota.id);
                }}>
                    <Trash2 className="h-6 w-6 text-slate-900" />
                </button>
            </div>
        </div>
    );
}