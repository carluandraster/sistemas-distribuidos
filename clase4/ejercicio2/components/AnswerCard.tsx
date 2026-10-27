import type { Question } from "../lib/Question";
import { useState } from "react";

type AnswerCardProps = {
    id: number;
    Question: Question;
    editable?: boolean;
    onChangeQuestion?: (id: number, question: string) => void;
    onDeleteQuestion?: (id: number) => void;
    onCreateOption?: (id: number, option: string) => void;
    onChangeOption?: (id: number, optionIndex: number, option: string) => void;
    onDeleteOption?: (id: number, optionIndex: number) => void;
    onClick: () => void;
};

export default function AnswerCard({
    id,
    Question,
    editable = false,
    onChangeQuestion,
    onDeleteQuestion,
    onCreateOption,
    onChangeOption,
    onDeleteOption,
    onClick
}: AnswerCardProps) {
    const [creatingOption, setCreatingOption] = useState<boolean>(false);
    return (
        <div
            className="flex flex-col gap-4 rounded-lg border border-solid border-black/[.08] bg-white p-4 shadow-sm dark:border-white/[.145] dark:bg-[#1a1a1a]"
            contentEditable={editable}
            suppressContentEditableWarning={true}
            onClick={onClick}
        >
            <div className="flex flex-col gap-2">
                {editable
                    ?   <input
                            type="text"
                            className="rounded-md border border-solid border-black/[.08] bg-white p-2 shadow-sm dark:border-white/[.145] dark:bg-[#1a1a1a]"
                            value={Question.question}
                            onChange={(e) => onChangeQuestion?.(id, e.target.value)}
                        />
                    :   <h3 className="text-lg font-semibold text-black dark:text-zinc-50">
                            {Question.question}
                        </h3>
                }
            </div>
            <div className="flex flex-col gap-2">
                {Question.options.map((option, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-2 rounded-md border border-solid border-black/[.08] bg-white p-2 shadow-sm hover:bg-gray-100 dark:border-white/[.145] dark:bg-[#1a1a1a] dark:hover:bg-[#2d2d2d]"
                    >
                        {editable
                            ?
                            <>
                                <input
                                    type="text"
                                    className="flex-1 rounded-md border border-solid border-black/[.08] bg-white p-2 shadow-sm dark:border-white/[.145] dark:bg-[#1a1a1a]"
                                    value={option}
                                    onChange={(e) => onChangeOption?.(id, index, e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="rounded-md bg-red-500 px-2 py-1 text-sm font-medium text-white hover:bg-red-600"
                                    onClick={() => onDeleteOption?.(id, index)}
                                >
                                    X
                                </button>
                                </>
                            :
                            <>
                                <input
                                    type="radio"
                                    name={Question.question}
                                    value={option}
                                    checked={false}
                                    onChange={() => {}}
                                />
                                <label className="text-sm font-medium text-black dark:text-zinc-50">
                                    {option}
                                </label>
                            </>
                        }
                    </div>
                ))}
                {creatingOption && (
                    <div className="flex items-center gap-2 rounded-md border border-solid border-black/[.08] bg-white p-2 shadow-sm hover:bg-gray-100 dark:border-white/[.145] dark:bg-[#1a1a1a] dark:hover:bg-[#2d2d2d]">
                        <input
                            type="text"
                            placeholder="Nueva opción"
                            className="flex-1 bg-transparent text-sm font-medium text-black placeholder:text-gray-500 focus:outline-none dark:text-zinc-50 dark:placeholder:text-zinc-400"
                            autoFocus={true}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    onCreateOption?.(id, (e.target as HTMLInputElement).value);
                                    setCreatingOption(false);
                                }
                                if (e.key === "Escape") {
                                    setCreatingOption(false);
                                }
                            }}
                        />
                    </div>
                )}
            </div>
            {editable && (
                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                        onClick={() => {setCreatingOption(true);}}>
                        Crear opción
                    </button>
                    <button
                        type="button"
                        className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
                        onClick={() => {
                            onDeleteQuestion?.(id);
                        }}
                    >
                        Eliminar
                    </button>
                </div>
            )}
        </div>
    );
}