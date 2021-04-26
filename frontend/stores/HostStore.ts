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
    @observable
    page: number ;
    @observable
    command: string ;

    constructor(rootStore: RootStore) {
        makeObservable(this);
        this.rootStore = rootStore;
        this.question = 0;
        this.page = 0;
        this.command = null;
    }

    @action
    async UpdateQuestion(): Promise<void> {
        this.question +=1;
    };
    @action
    async UpdatePage(p): Promise<void> {
        this.page =p;
    };

    @action
    async UpdateCommand(c): Promise<void> {
        this.command =c;
    };
}

export default HostStore;