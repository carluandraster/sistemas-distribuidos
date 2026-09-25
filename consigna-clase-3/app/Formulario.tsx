import { Nota } from "./Nota";

export default function Formulario(prop: { nota: Nota | null }) {
    const nota = prop.nota;
    return (
        <form className="flex flex-col gap-4 rounded-lg border border-white/30 bg-white/10 p-6 shadow-lg backdrop-blur-md">
            <input
                type="text"
                placeholder="Título"
                className="rounded-lg border border-white/30 bg-white/10 p-2 text-slate-900 placeholder:text-slate-500 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <textarea
                placeholder="Contenido"
                className="rounded-lg border border-white/30 bg-white/10 p-2 text-slate-900 placeholder:text-slate-500 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <input
                type="color"
                className="h-10 w-10 rounded-lg border border-white/30 p-0 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <input
                type="number"
                placeholder="Minutos de validez"
                className="rounded-lg border border-white/30 bg-white/10 p-2 text-slate-900 placeholder:text-slate-500 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <button
                type="submit"
                className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            >
                Agregar Nota
            </button>
        </form>
    )
}