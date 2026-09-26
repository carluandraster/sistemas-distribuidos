import { useState } from "react";

export interface PropsForm{
    editar: boolean,
    tituloInicial: string,
    textoInicial: string,
    colorDeFondoInicial: string,
    minutosDeValidezInicial: number,
    onSubmit: (values: { title: string; text: string; minutes: number; color: string }) => void,
    onCancelar: () => void
}

/**
 * Crea un formulario para agregar o modificar una nota.
 * 
 * @param prop Objeto que contiene la nota a modificar (si aplica). Puede ser null si se está agregando una nueva nota.
 * @param prop.nota La nota a modificar. Si es null, se asume que se está agregando una nueva nota.
 * 
 * @returns Código HTML con el formulario para agregar o modificar una nota.
 */
export default function Formulario(props: PropsForm) {
    const [title, setTitle] = useState(props.tituloInicial);
    const [text, setText] = useState(props.textoInicial);
    const [minutesInput, setMinutesInput] = useState(props.minutosDeValidezInicial.toString());
    const [color, setColor] = useState(props.colorDeFondoInicial);
    const [error, setError] = useState("");

    function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        const nextTitle = title.trim();
        const nextText = text.trim();
        const minutes = Number(minutesInput);
        const nextColor = color.trim();

        if (!nextTitle) {
            setError("El título es obligatorio.");
            return;
        }
        if (!Number.isInteger(minutes) || minutes < 1) {
            setError("Los minutos de validez tienen que ser un entero mayor a 0.");
            return;
        }
        if (!nextColor) {
            setError("El color de fondo es obligatorio.");
            return;
        }

        props.onSubmit({ title: nextTitle, text: nextText, minutes: minutes, color: nextColor });
        setTitle("");
        setText("");
        setMinutesInput("1");
        setError("");
    }
    return (
        <form className="flex flex-col gap-4 rounded-lg border border-white/30 bg-white/10 p-6 shadow-lg backdrop-blur-md">
            <input
                type="text"
                placeholder="Título"
                    className="rounded-lg border border-white/30 bg-white/10 p-2 text-slate-900 placeholder:text-slate-500 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
                placeholder="Contenido"
                    className="rounded-lg border border-white/30 bg-white/10 p-2 text-slate-900 placeholder:text-slate-500 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <input
                type="color"
                    className="h-10 w-10 rounded-lg border border-white/30 p-0 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                value={color}
                onChange={(e) => setColor(e.target.value)}
            />
            <input
                type="number"
                placeholder="Minutos de validez"
                    className="rounded-lg border border-white/30 bg-white/10 p-2 text-slate-900 placeholder:text-slate-500 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                value={minutesInput}
                onChange={(e) => setMinutesInput(e.target.value)}
            />
            <div className="flex justify-end gap-2">
                <button
                    type="submit"
                    className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                >
                {  props.editar ? "Guardar cambios" : "Agregar nota"}
                </button>
                {props.editar ? (
                    <button type="button" onClick={props.onCancelar} style={{ cursor: "pointer" }}>
                        Cancelar
                    </button>
                ) : null}
            </div>
        </form>
            
    )
}