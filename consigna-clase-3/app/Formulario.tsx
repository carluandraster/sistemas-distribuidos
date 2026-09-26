import { Nota } from "./Nota";

/**
 * Crea un formulario para agregar o modificar una nota.
 * 
 * @param prop Objeto que contiene la nota a modificar (si aplica). Puede ser null si se está agregando una nueva nota.
 * @param prop.nota La nota a modificar. Si es null, se asume que se está agregando una nueva nota.
 * 
 * @returns Código HTML con el formulario para agregar o modificar una nota.
 */
export default function Formulario(prop: { nota: Nota | null }) {
    const nota = prop.nota;
    return nota == null ? (
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
    ) : (
        <form className="flex flex-col gap-4 rounded-lg border border-white/30 bg-white/10 p-6 shadow-lg backdrop-blur-md">
            <input
                type="text"
                placeholder="Título"
                    className="rounded-lg border border-white/30 bg-white/10 p-2 text-slate-900 placeholder:text-slate-500 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                value={nota.Titulo}
            />
            <textarea
                placeholder="Contenido"
                    className="rounded-lg border border-white/30 bg-white/10 p-2 text-slate-900 placeholder:text-slate-500 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                value={nota.Texto}
            />
            <input
                type="color"
                    className="h-10 w-10 rounded-lg border border-white/30 p-0 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                value={nota.ColorDeFondo}
            />
            <input
                type="number"
                placeholder="Minutos de validez"
                    className="rounded-lg border border-white/30 bg-white/10 p-2 text-slate-900 placeholder:text-slate-500 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                value={nota.MinutosDeValidez}
            />
            <button
                type="submit"
                className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            >
                Modificar Nota
            </button>
        </form>
            
    )
}