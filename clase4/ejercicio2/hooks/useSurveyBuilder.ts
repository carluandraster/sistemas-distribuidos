"use client";

import { useState, useEffect } from "react";
import { Question } from "@/lib/Question";
import { Quiz } from "@/lib/Quiz";

/**
 * # useSurveyBuilder
 * **Hook para construir una encuesta.**
 * 
 * **Pre:** la encuesta aún no fue contestada por nadie
 * 
 * @param surveyId <br>
 * ID de la encuesta si ya existía
 * 
 * @returns Objeto con los datos de la encuesta:
 * - **setUser**: Función para establecer el usuario que está creando la encuesta
 * - **title**: Título de la encuesta
 * - **setTitle**: Función para modificar el título
 * - **questions**: Lista de preguntas de la encuesta
 * - **addQuestion**: Función para agregar una pregunta
 * - **removeQuestion**: Función para eliminar una pregunta
 * - **updateQuestion**: Función para modificar una pregunta
 * - **addOption**: Función para agregar una opción a una pregunta
 * - **removeOption**: Función para eliminar una opción de una pregunta
 * - **updateOption**: Función para modificar una opción de una pregunta
 * - **valid**: Booleano que indica si la encuesta es válida (título y preguntas no vacías)
 * - **submitSurvey**: Función para enviar la encuesta al servidor
 * - **error**: Mensaje de error si ocurre algún problema
 * 
 * @example const { 
                title, setTitle, 
                questions, addQuestion, removeQuestion, updateQuestion,
                addOption, removeOption, updateOption,
                valid, submitSurvey, error
            } = useSurveyBuilder(id);
 */
export default function useSurveyBuilder(surveyId: string | null) {
    const [error, setError] = useState<string | null>(null);
    const [title, setTitle] = useState<string>("");
    const [questions, setQuestions] = useState<Question[]>([]);
    const [valid, setValid] = useState<boolean>(true);
    const [user, setUser] = useState<string | null>(null);

    async function load_survey() {
        let id = surveyId as string;
        await fetch(`@/app/api/survey`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "id": id, // Agrega el ID de la encuesta a los encabezados
            },
        }).then(async (response) => {
            if (!response.ok) {
                throw new Error("Falló la API");
            } else {
                const json: Quiz = await response.json();
                setTitle(json.title);
                setQuestions(json.questions);
            }
        }).catch(e => setError(`Error: ${e}`))
    }

    // Si el formulario ya existía, lo solicito
    if (surveyId != null){
        load_survey();
    }

    // # Funciones útiles
    // ## Preguntas

    /**
     * Añade una nueva pregunta sin opciones al formulario
     * @param question<br>
     * Nueva pregunta
     */
    function addQuestion(question: string) {
        setQuestions([...questions, {
            question,
            options: []
        }])
    }

    /**
     * Elimina una pregunta del formulario
     * @param idx <br>
     * Índice de la pregunta a eliminar
     */
    function removeQuestion(idx: number) {
        const questionRemoved = questions[idx].question;
        setQuestions(questions.filter((q) => q.question !== questionRemoved));
    }

    /**
     * Actualiza una pregunta sin tocar sus opciones
     * @param oldQuestion <br>
     * Índice de la pregunta a modificar
     * @param newQuestion <br>
     * La pregunta que debería ir en su lugar
     */
    function updateQuestion(oldQuestion: number, newQuestion: string) {
        questions[oldQuestion].question = newQuestion;
        setQuestions(questions);
    }

    // ## Opciones (de cada pregunta)
    /**
     * Agrega una nueva opción a una pregunta
     * @param question<br>
     * Índice de la pregunta a la cual agregar una opción
     * @param option<br>
     * La nueva opción
     */
    function addOption(question: number, option: string) {
        questions
            [question].options
            .push(option);
        setQuestions(questions);
    }

    /**
     * Elimina una opción de una pregunta
     * @param question<br>
     * Índice de la pregunta que tiene la opción a ser eliminada
     * @param option<br>
     * La opción que debe ser removida
     */
    function removeOption(question: number, option: number) {
        questions[question]
            .options
            .splice(
                option
            , 1);
        setQuestions(questions);
    }

    /**
     * Modifica una opción
     * @param question<br>
     * Índice de la pregunta que contiene la opción a ser reemplazada
     * @param oldOption <br>
     * Índice de la opción que debe ser modificada
     * @param newOption <br>
     * La opción que va en su lugar
     */
    function updateOption(question: number, oldOption: number, newOption: string) {
        questions[question].options[oldOption] = newOption;
        setQuestions(questions);
    }

    // ## Validación
    useEffect(() => {
        const invalidQuestions = questions
            .filter(q => q.question === "" ||
                q.options.filter(o => o === "").length > 0 ||
                q.options.length === 0
            )
        setValid(title !== "" && invalidQuestions.length === 0 && user !== null);
    }, [title, questions]);

    // ## Guardado
    async function submitSurvey() {
        const owner = user as string;
        surveyId = surveyId === null
            ? crypto.randomUUID()
            : surveyId;
        const newSurvey = {
            author: owner,
            id: surveyId,
            title,
            questions
        };
        try {
            const response = await fetch(`@/app/api/survey`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newSurvey)
            });
            if (!response.ok) {
                throw new Error("Falló la API");
            }
        } catch (error) {
            setError(`Error al enviar la encuesta: ${error}`);
        }
    }
    return {
        setUser,
        title, setTitle,
        questions, addQuestion, removeQuestion, updateQuestion,
        addOption, removeOption, updateOption,
        valid, submitSurvey, error
    };
}