"use client";

import useSurveyBuilder from "@/hooks/useSurveyBuilder";
import Form from "./Form";
import { QuestionBoxEdit } from "./QuestionBoxEdit";
import { useState } from "react";

export default function Edit() {
    const id = sessionStorage.getItem("id");
    const { 
        title, setTitle, 
        questions, addQuestion, removeQuestion, updateQuestion,
        addOption, removeOption, updateOption,
        valid, submitSurvey, error
    } = useSurveyBuilder(id);
    const [editingId, setEditingId] = useState<number>(NaN);
    return (
        <div>
            {error && (
                <div className="rounded-lg bg-red-500 p-4 text-white">
                    {error}
                </div>
            )}
            <Form
                title={
                    <input
                        className="text-xl font-semibold text-black dark:text-zinc-50"
                        contentEditable={true}
                        suppressContentEditableWarning={true}
                        onChange={(e) => setTitle(e.target.value)}
                    >
                        {title}
                    </input>
                }
                btnSubmit={
                    <button
                        className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
                        onClick={submitSurvey}
                        disabled={!valid}
                    >
                        Save
                    </button>
                }
            >
                {questions.map((question, index) => (
                    <QuestionBoxEdit
                        key={index}
                        index={index}
                        question={question}
                        selected={editingId === index}
                        onQuestionChange={updateQuestion}
                        onDeleteQuestion={removeQuestion}
                        onAddOption={addOption}
                        onOptionChange={updateOption}
                        onDeleteOption={removeOption}
                        onClick={() => setEditingId(index)}
                    />
                ))}
                <button onClick={()=>addQuestion("")}>Add Question</button>
            </Form>
        </div>
    );
}