"use client";

import useSurveyBuilder from "@/hooks/useSurveyBuilder";
import Quiz from "./Quiz";

export default function Edit() {
    const id = sessionStorage.getItem("id");
    const { 
        title, setTitle, 
        questions, addQuestion, removeQuestion, updateQuestion,
        addOption, removeOption, updateOption,
        valid, submitSurvey, error
    } = useSurveyBuilder(id);
    return (
        <Quiz
            title={title}
            answers={questions}
            onCreate={[addQuestion, addOption]}
            onChange={[updateQuestion, updateOption, setTitle]}
            onDelete={[removeQuestion, removeOption]}
        />
    );
}