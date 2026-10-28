import QuestionBox from "./QuestionBox.js";
import { Question } from "../lib/Question.js";
import QuestionBoxVote from "./QuestionBoxVote.js";

interface PollCardEditProps {
    index: number;
    question: Question;
    selected: boolean;
    onQuestionChange: (index: number, newQuestion: string) => void;
    onDeleteQuestion: (index: number) => void;
    onAddOption: (newOption: string) => void;
    onOptionChange: (optionIndex: number, newOption: string) => void;
    onDeleteOption: (optionIndex: number) => void;
    onClick: () => void;
}

export function QuestionBoxEdit({
    index,
    question,
    selected,
    onQuestionChange,
    onDeleteQuestion,
    onAddOption,
    onOptionChange,
    onDeleteOption,
    onClick,
}: PollCardEditProps) { 
    return (
        selected ? (
            <QuestionBox index={index} headerAction={
                <div>
                    <button
                        className="text-red-500 hover:text-red-700"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDeleteQuestion(index);
                        }}>
                        Eliminar
                    </button>
                    <button
                        className="text-green-500 hover:text-green-700"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddOption("");
                        }}>
                        Agregar opción
                    </button>
                </div>
            }>
                <input
                    type="text"
                    value={question.question}
                    onChange={(e) => onQuestionChange(index, e.target.value)}
                />
                <div>
                    {question.options.map((option, i) => (
                        <div>
                            <input
                                type="text"
                                name={`question-${index} - option-${i}`}
                                key={i}
                                onChange={(e) => onOptionChange(i, e.target.value)}>
                                {option}
                            </input>
                            <button
                                className="text-red-500 hover:text-red-700"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteOption(i);
                                }}>
                                Eliminar opción
                            </button>
                        </div>
                    ))}
                </div>
            </QuestionBox>
        ) : (
            <QuestionBoxVote
                index={index}
                question={question}
                onVote={() => { }}
                onClick={onClick}
            />
        )
    )
}