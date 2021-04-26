import {
    action,
    computed,
    makeObservable,
    observable,
    runInAction,
} from 'mobx';
import RootStore from './RootStore';
import axios, { AxiosError } from 'axios';

export class PlayerStore {
    private rootStore: RootStore;
    @observable
    id: number | null;
    @observable
    totalScore: number;
    @observable
    timer: number;
    @observable
    choice: number | null;
    @observable
    page: number;
    @observable
    numberChoices: number;
    @observable
    clickAt: number;
    @observable
    questionChoices: any;
    @observable
    answerChoices: any;
    @observable
    questionState: boolean;

    constructor(rootStore: RootStore) {
        makeObservable(this);
        this.rootStore = rootStore;
        this.timer = 0;
        this.totalScore = 0;
        this.choice = null;
        this.page = 0;
        this.clickAt = 0;
        this.questionChoices = null;
        this.answerChoices = null;
        this.questionState = null;
    }

    @action
    async setTimer(timer): Promise<void> {
        this.timer = timer;
    }
    @action
    async setQuestionChoices(questionChoices): Promise<void> {
        this.questionChoices = questionChoices;
    }

    @action
    async setAnswerChoices(answerChoices): Promise<void> {
        this.answerChoices = answerChoices;
    }

    @action
    async setQuestionState(questionState): Promise<void> {
        this.questionState = questionState;
    }

    @action
    async setClickAt(): Promise<void> {
        this.clickAt = this.timer;
    }

    async setChoice(choice): Promise<void> {
        this.choice = choice;
    }

    @action
    async UpdateScore(): Promise<void> {
        this.totalScore += this.timer;
    }

    @action
    async UpdatePage(p): Promise<void> {
        this.page = p;
    }

    @action
    async UpdateNumberChoice(nc): Promise<void> {
        this.numberChoices = nc;
    }
}

export default PlayerStore;
