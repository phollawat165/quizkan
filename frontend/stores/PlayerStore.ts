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
    @observable
    personalScore: any;
    @observable
    state: string;

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
        this.personalScore = null;
        this.state = null;
    }

    @action
    setTimer(timer): void {
        this.timer = timer;
    }
    @action
    setQuestionChoices(questionChoices): void {
        this.questionChoices = questionChoices;
    }

    @action
    setAnswerChoices(answerChoices): void {
        this.answerChoices = answerChoices;
    }

    @action
    setQuestionState(questionState): void {
        this.questionState = questionState;
    }

    @action
    setClickAt(): void {
        this.clickAt = this.timer;
    }

    @action
    setChoice(choice): void {
        this.choice = choice;
    }

    @action
    setTotalScore(totalScore): void {
        this.totalScore = totalScore;
    }

    @action
    UpdatePage(p): void {
        this.page = p;
    }

    @action
    UpdateNumberChoice(nc): void {
        this.numberChoices = nc;
    }

    @action
    setPersonalScore(personalScore): void {
        this.personalScore = personalScore;
    }
    @action
    setState(state): void {
        this.state = state;
    }
}

export default PlayerStore;
