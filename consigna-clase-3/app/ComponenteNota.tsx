import { Controlador } from "./Controlador";
import Formulario from "./Formulario";
import { Nota } from "./Nota";
import { Pencil, Trash2 } from 'lucide-react';

export default function ComponenteNota(props: { nota: Nota }) {
    const nota = props.nota;
    const controlador = Controlador.getInstance();
    return (
        <div
            className="nota rounded-2xl border border-white/30 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            style={{ backgroundColor: nota.ColorDeFondo }}
        >
            <h2 className="mb-3 text-xl font-bold tracking-tight text-slate-900">
                {nota.Titulo}
            </h2>
            <p className="leading-relaxed text-slate-800">{nota.Texto}</p>
            // Botones para modificar y eliminar la nota
            <div className="mt-4 flex justify-end gap-2">
                <button onClick={() => {
                    // Se muestra el formulario para modificar la nota, pasando la nota actual como prop
                    Formulario({ nota: nota });
                }}>
                    <Pencil className="h-6 w-6 text-slate-900" />
                </button>
                <button onClick={() => {
                    if(window.confirm("¿Estás seguro de que deseas eliminar esta nota?"))
                        controlador.onEliminarNota(nota.Id);
                }}>
                    <Trash2 className="h-6 w-6 text-slate-900" />
                </button>
            </div>
        </div>
    );
}