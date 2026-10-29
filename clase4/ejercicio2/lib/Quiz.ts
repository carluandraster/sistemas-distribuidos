import { Question } from "./Question";

export type Quiz = {
    id: string;
    title: string;
    questions: Question[];
}