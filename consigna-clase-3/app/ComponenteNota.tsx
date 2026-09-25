import { Nota } from "./Nota";

export default function ComponenteNota(props: { nota: Nota }) {
    const nota = props.nota;
    return (
        <div
            className="nota rounded-2xl border border-white/30 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            style={{ backgroundColor: nota.ColorDeFondo }}
        >
            <h2 className="mb-3 text-xl font-bold tracking-tight text-slate-900">
                {nota.Titulo}
            </h2>
            <p className="leading-relaxed text-slate-800">{nota.Texto}</p>
        </div>
    );
}