import { Tree } from "./Tree";

export class Survey extends Tree<string>{
    public constructor(title: string) {
        super(title);
    }

    public get getTitle() {
        return this.get([]);
    }

    public set setTitle(newTitle: string) {
        this.set([], newTitle);
    }

    public getQuestion(idx: number) {
        return this.get([idx]);
    }

    public setQuestion(idx: number, newQuestion: string) {
        this.set([idx], newQuestion);
    }

    public addQuestion(newQuestion: string) {
        this.addChild([], newQuestion);
    }

    public getOption(iQ: number, iO: number) {
        return this.get([iQ, iO]);
    }

    public setOption(iQ: number, iO: number, newOption: string) {
        this.set([iQ, iO], newOption);
    }

    public addOption(iQ: number, newOption: string) {
        this.addChild([iQ], newOption);
    }
}