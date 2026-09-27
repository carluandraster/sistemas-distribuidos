import { Pencil, Trash2, Clock } from 'lucide-react';
import { estaExpirada, expiraEn, Note } from "../lib/Notas";
import { useEffect, useState } from 'react';

export interface PropsNota{
    nota: Note;
    seleccionada: boolean;
    onEditar: (nota: Note) => void;
    onEliminar: (id: number) => void;
}

export function Nota(props: PropsNota) {
    const [tiempoRestante, setTiempoRestante] = useState(expiraEn(props.nota));
    useEffect(() => {
        const interval = setInterval(() => {
            setTiempoRestante(expiraEn(props.nota));
        }, 1000);
        return () => clearInterval(interval);
    }, [props.nota]);
    return (
        <div
            className="nota rounded-2xl border border-white/30 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            style={{ backgroundColor: props.nota.color }}
        >
            <h2 className="mb-3 text-xl font-bold tracking-tight text-slate-900">
                {props.nota.title}
            </h2>
            <p className="leading-relaxed text-slate-800">{props.nota.text}</p>
            {/* Botones para modificar y eliminar la nota y reloj de tiempo */}
            <div className="mt-4 flex justify-end gap-2">
                <div className="flex items-center gap-1 rounded-lg bg-slate-900/20 px-2 py-1 text-sm text-slate-900">
                    <Clock className="h-4 w-4" />
                    {estaExpirada(props.nota)
                        ? "Expirada"
                        : (tiempoRestante / 60000) >= 1
                            ? `${(tiempoRestante / 60000).toFixed(0)} min`
                            : `${(tiempoRestante / 1000).toFixed(0)} seg`  }
                </div>
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