import {
    action,
    computed,
    makeObservable,
    observable,
    runInAction,
} from 'mobx';
import RootStore from './RootStore';
import axios, { AxiosError } from 'axios';

export class HostStore {
    private rootStore: RootStore;
    @observable
    id: number | null;
    @observable
    question: number;
    @observable
    page: number;
    @observable
    command: string;
    @observable
    questionChoices: any;
    @observable
    answerChoices: any;
    @observable
    questionState: boolean;
    @observable
    people: any;
    @observable
    state: string;
    @observable
    score: any;

    constructor(rootStore: RootStore) {
        makeObservable(this);
        this.rootStore = rootStore;
        this.page = 0;
        this.command = null;
        this.questionChoices = null;
        this.answerChoices = null;
        this.questionState = null;
        this.people = [];
        this.score = [];
    }
    @action
    UpdatePage(p): void {
        this.page = p;
    }

    @action
    setPeople(p): void {
        this.people = p;
    }

    @action
    UpdateCommand(c): void {
        this.command = c;
    }

    @action
    setQuestionChoices(qc): void {
        this.questionChoices = qc;
    }

    @action
    setAnswerChoices(ac): void {
        this.answerChoices = ac;
    }

    @action
    setQuestionState(qs): void {
        this.questionState = qs;
    }

    @action
    setState(s): void {
        this.state = s;
    }
    @action
    setScore(score): void {
        this.score = score;
    }
}

export default HostStore;
