import { MultipleChoice } from "./Question";

export type Quiz = {
    id: string;
    title: string;
    questions: MultipleChoice[];
}