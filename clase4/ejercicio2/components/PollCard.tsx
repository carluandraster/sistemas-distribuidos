import {ReactNode} from "react";

interface QuestionBoxProps {
  index: number;
  headerAction?: ReactNode; // Hueco opcional (ej. para el botón de eliminar pregunta)
  children: ReactNode;     // Acá adentro va la pregunta (input o texto) y las opciones
}

export function QuestionBox({ index, headerAction, children }: QuestionBoxProps) {
  return (
    <div className="p-4 mb-4 border rounded-lg bg-white shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold uppercase text-blue-600">
          Pregunta #{index + 1}
        </span>
        {headerAction}
      </div>
      
      {/* Todo el contenido dinámico entra por acá */}
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}