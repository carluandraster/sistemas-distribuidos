import { MultipleChoice } from "./MultipleChoice";

export type Quiz = {
    id: string;
    title: string;
    questions: MultipleChoice[];
}