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

    constructor(rootStore: RootStore) {
        makeObservable(this);
        this.rootStore = rootStore;
        this.page = 0;
        this.command = null;
        this.questionChoices = null;
        this.answerChoices = null;
        this.questionState = null;
    }
    @action
    async UpdatePage(p): Promise<void> {
        this.page = p;
    }

    @action
    async UpdateCommand(c): Promise<void> {
        this.command = c;
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
}

export default HostStore;
