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
    question: number ;

    constructor(rootStore: RootStore) {
        makeObservable(this);
        this.rootStore = rootStore;
        this.question = 0;
    }

    @action
    async UpdateQuestion(): Promise<void> {
        this.question +=1;
    };
}

export default HostStore;