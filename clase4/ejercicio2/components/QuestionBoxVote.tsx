import { Question } from "@/lib/Question.js";
import QuestionBox from "./QuestionBox.js";

interface PollCardVoteProps {
    index: number;
    question: Question;
    onVote: (question: string, optionIndex: number) => void;
    onClick?: () => void; // Función que se ejecuta al hacer click en la caja de la pregunta
}

export default function QuestionBoxVote({
    index,
    question,
    onVote,
    onClick
}: PollCardVoteProps) {
    return (
        <QuestionBox index={index} onClick={onClick}>
            <p>{question.question}</p>
            <div>
                {question.options.map((option, i) => (
                    <input
                        type="radio"
                        name={`question-${index} - option-${i}`}
                        key={i}
                        onChange={() => onVote(question.question, i)}>
                        {option}
                    </input>
                ))}
            </div>
        </QuestionBox>
    )
}