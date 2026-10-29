import AnswerCard from "./AnswerCard";
import { ReactNode } from "react";
import { Quiz } from "../lib/Quiz";

const QUESTION = 0;
const OPTION = 1;

type FormProps = {
    title: ReactNode;
    children: ReactNode;
    btnSubmit: ReactNode;
};

export default function Form({
    title,
    children,
    btnSubmit
}: FormProps) {
    return (
        <div className="flex flex-col gap-4 rounded-lg border border-solid border-black/[.08] bg-white p-4 shadow-sm dark:border-white/[.145] dark:bg-[#1a1a1a]">
            <div className="flex flex-col gap-2">
                {title}
            </div>
            {children}
            {btnSubmit}
        </div>
    )
}