import AnswerCard from "./AnswerCard";
import type { ComponentProps } from "react";

type QuizProps = {
    title: string;
    answers: ComponentProps<typeof AnswerCard>["multipleChoice"][];
    editable?: boolean;
    onChange?: () => void;
    onDelete?: () => void;
};

export default function Quiz({
    title,
    answers,
    editable = false,
    onChange = () => { },
    onDelete = () => { },
}: QuizProps) {
    return (
        <div className="flex flex-col gap-4 rounded-lg border border-solid border-black/[.08] bg-white p-4 shadow-sm dark:border-white/[.145] dark:bg-[#1a1a1a]">
            <div className="flex flex-col gap-2">
                <h2 className="text-xl font-semibold text-black dark:text-zinc-50">
                    {title}
                </h2>
            </div>
            {answers.map((answer, index) => (
                <AnswerCard
                    key={index}
                    multipleChoice={answer}
                    editable={editable}
                    onChange={onChange}
                    onDelete={onDelete}
                />
            ))}
        </div>
    )
}