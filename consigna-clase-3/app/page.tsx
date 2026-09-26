"use client";
import ComponenteNota from "./ComponenteNota";
import { Notas, KEY } from "./Notas";
import { useState, useEffect } from "react";
import Formulario from "./Formulario";

export default function Home() {
  const [notas, setNotas] = useState<Notas>(localStorage.getItem(KEY) ? JSON.parse(localStorage.getItem(KEY) as string) : new Notas());
  useEffect(() => {
    const storedNotas = localStorage.getItem(KEY);
    if (storedNotas) {
      setNotas(JSON.parse(storedNotas));
    }
  }, notas);
  let htmlNotas = notas.map((nota) => (
    <ComponenteNota nota={nota} />
  ));
  let btnCrearNota = (<button
      className="fixed bottom-4 right-4 rounded-full bg-blue-500 p-4 text-white shadow-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50"
      onClick={() => Formulario({ nota: null })}
    >
      + Crear Nota
  </button>)
  let htmlCompleto = [notas.length > 0 ? (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {htmlNotas}
      </div>
    ) : (
      <p className="text-center text-slate-500">No hay notas para mostrar.</p>
  ), btnCrearNota];
  return (htmlCompleto);
}
