import type { MultipleChoice } from "../lib/MultipleChoice";
import { useState } from "react";

type AnswerCardProps = {
    multipleChoice: MultipleChoice;
    editable?: boolean;
    onChange?: () => void;
    onDelete?: () => void;
};

export default function AnswerCard({
    multipleChoice,
    editable = false,
    onChange = () => {},
    onDelete = () => {},
}: AnswerCardProps) {
    const [editing, setEditing] = useState(false);
    return (
        <div
            className="flex flex-col gap-4 rounded-lg border border-solid border-black/[.08] bg-white p-4 shadow-sm dark:border-white/[.145] dark:bg-[#1a1a1a]"
            contentEditable={editable && editing}
            suppressContentEditableWarning={true}
            onClick={() => {
                if (editable) {
                    setEditing(true);
                }
            }}
        >
            <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold text-black dark:text-zinc-50">
                    {multipleChoice.question}
                </h3>
            </div>
            <div className="flex flex-col gap-2">
                {multipleChoice.options.map((option, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-2 rounded-md border border-solid border-black/[.08] bg-white p-2 shadow-sm hover:bg-gray-100 dark:border-white/[.145] dark:bg-[#1a1a1a] dark:hover:bg-[#2d2d2d]"
                    >
                        <input
                            type="radio"
                            name={multipleChoice.question}
                            value={option}
                            checked={false}
                            onChange={() => {}}
                        />
                        <label className="text-sm font-medium text-black dark:text-zinc-50">
                            {option}
                        </label>
                    </div>
                ))}
            </div>
            {editing && (
                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                        onClick={() => {
                            setEditing(false);
                            onChange();
                        }}
                    >
                        Guardar
                    </button>
                    <button
                        type="button"
                        className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
                        onClick={() => {
                            setEditing(false);
                            onDelete();
                        }}
                    >
                        Eliminar
                    </button>
                </div>
            )}
        </div>
    );
}