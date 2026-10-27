import AnswerCard from "./AnswerCard";
import { ComponentProps, useState } from "react";

const QUESTION = 0;
const OPTION = 1;

type QuizProps = {
    title: string;
    answers: ComponentProps<typeof AnswerCard>["multipleChoice"][];
    onCreate: CallableFunction[];
    onChange: CallableFunction[];
    onDelete: CallableFunction[];
};

export default function Quiz({
    title,
    answers,
    onCreate = [], // [addQuestion, addOption]
    onChange = [], // [updateQuestion, updateOption, setTitle]
    onDelete = [], // [removeQuestion, removeOption]
}: QuizProps) {
    const editable = onCreate.length + onChange.length + onDelete.length === 0;
    const [editingId, setEditingId] = useState<number>(NaN);
    return (
        <div className="flex flex-col gap-4 rounded-lg border border-solid border-black/[.08] bg-white p-4 shadow-sm dark:border-white/[.145] dark:bg-[#1a1a1a]">
            <div className="flex flex-col gap-2">
                <h2 className="text-xl font-semibold text-black dark:text-zinc-50" contentEditable={editable}>
                    {title}
                </h2>
            </div>
            {answers.map((answer, index) => (
                <AnswerCard
                    key={index}
                    id={index}
                    multipleChoice={answer}
                    editable={index === editingId && editable}
                    onChangeQuestion = {onChange[QUESTION]}
                    onDeleteQuestion = {onDelete[QUESTION]}
                    onCreateOption = {onCreate[OPTION]}
                    onChangeOption = {onChange[OPTION]}
                    onDeleteOption={onDelete[OPTION]}
                    onClick = {() => setEditingId(index)}
                />
            ))}
        </div>
    )
}