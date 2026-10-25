import { Quiz } from "./Quiz";

export interface Vote extends Quiz {
    answers: { [question: string]: number[] }; // 0 si no se votó, 1 si se votó
}

function sume(vote1: Vote, vote2: Vote): Vote {
    const newVote: Vote = {
        id: vote1.id,
        title: vote1.title,
        questions: vote1.questions,
        answers: {},
    };
    for (const question in vote1.answers) {
        newVote.answers[question] = vote1.answers[question].map((answer, index) => answer + (vote2.answers[question]?.[index] || 0));
    }
    return newVote;
}

export function sumatory(votes: Vote[]): Vote {
    return votes.reduce((acc, vote) => sume(acc, vote));
}