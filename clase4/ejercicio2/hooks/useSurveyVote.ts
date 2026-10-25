"use client";

import { useState, useEffect } from "react";
import { Vote } from "@/lib/Vote";

/**
 * Hook para votar en una encuesta.
 * @param surveyId - ID de la encuesta
 * @returns Objeto con los datos de la encuesta:
 * - vote: Objeto con las respuestas del usuario
 * - addVote: Función para agregar una respuesta a una pregunta
 * - updateVote: Función para modificar una respuesta a una pregunta
 * - submitVote: Función para enviar las respuestas al servidor
 * - error: Mensaje de error si ocurre algún problema
 */
export function useSurveyVote(surveyId: string) {
    const [vote, setVote] = useState< Vote | null >(null);
    const [error, setError] = useState<string | null>(null);
    const [valid, setValid] = useState<boolean>(false);

    // Traer del servidor la encuesta y sus preguntas
    async function load_survey() {
        await fetch(`@/app/api/survey`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "id": surveyId, // Agrega el ID de la encuesta a los encabezados
            },
        }).then(async (response) => {
            if (!response.ok) {
                throw new Error("Falló la API");
            }
            return await response.json();
        }).then((json) => {
            setVote({
                id: json.id,
                title: json.title,
                questions: json.questions,
                answers: json.questions.reduce((acc: { [question: string]: number[] }, question: any) => {
                    acc[question.question] = new Array(question.options.length).fill(0);
                    return acc;
                }, {} as { [question: string]: number[] }),
            });
        }).catch((error) => {
            setError(error.message);
        });
    }

    useEffect(() => {
        load_survey();
    }, [surveyId]);

    /**
     * Agrega una respuesta a una pregunta.
     * @param question ID de la pregunta
     * @param answer Índice de la opción seleccionada
     */
    function writeVote(question: string, answer: number) {
        vote?.answers[question].forEach((_, index) => {
            vote.answers[question][index] = index === answer ? 1 : 0;
        });
        setVote(vote);
    }

    useEffect(() => {
        if (vote) {
            const allQuestionsAnswered = Object.values(vote.answers).every((answers) => answers.some((answer) => answer === 1));
            setValid(allQuestionsAnswered);
        }
    }, [vote]);

    async function submitVote() {
        if (valid) {
            // Enviar las respuestas al servidor
            await fetch(`@/app/api/response`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "id": surveyId, // Agrega el ID de la encuesta a los encabezados
                },
                body: JSON.stringify(vote),
            });
        } else {
            setError("Por favor, responde todas las preguntas antes de enviar tu voto.");
        }
    }

    return {
        vote,
        writeVote,
        submitVote,
        error
    };
}