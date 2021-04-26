import {
    action,
    autorun,
    comparer,
    computed,
    makeObservable,
    observable,
    runInAction,
    toJS,
} from 'mobx';
import RootStore from './RootStore';
import { io, Socket } from 'socket.io-client';

export class WebSocketStore {
    private rootStore: RootStore;
    // Socket related data
    @observable.deep
    socket?: Socket;

    @observable
    url: string;

    @observable
    isConnected: boolean;

    @observable
    opts: any;

    @observable
    token: string;

    // Game data
    @observable
    host: boolean;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        this.socket = null;
        this.isConnected = false;
        const urlObject = new URL(process.env.NEXT_PUBLIC_API_ENDPOINT);
        this.url = `ws://${urlObject.host}`;
        this.opts = {
            auth: { token: '' },
            transports: ['websocket'],
        };
        this.host = false;
        makeObservable(this);
    }

    /**
     *
     */
    @action
    registerListeners(): void {
        // Chat
        this.socket.on('message', (payload) => {
            console.log('Message received:', payload);
            this.testAction();
        });
        // Set time
        this.socket.on('setTime', (payload) => {
            this.rootStore.playerStore.setTimer(payload.time);
        });
        this.socket.on('setQuestionState', (payload) => {
            // be ready for the next question
            // this will be called after time 5 seconds timer is completed
            this.rootStore.playerStore.setQuestionState(payload.question);
            this.rootStore.hostStore.setQuestionChoices(payload.choices);
        });
        // Set question
        this.socket.on('setQuestion', (payload) => {
            // Incoming new question
            // rootStore.questionStore.setQuestion()
            this.rootStore.playerStore.setQuestionChoices(payload.choices);
            this.rootStore.hostStore.setQuestionChoices(payload.choices);
        });
        this.socket.on('setAnswer', (payload) => {
            // Incoming new question
            // rootStore.questionStore.setQuestion()
            this.rootStore.playerStore.setAnswerChoices(payload.choices);
            this.rootStore.hostStore.setQuestionChoices(payload.choices);
        });
    }

    @action
    testAction(): void {
        console.log('Action can be called within a listener!');
    }

    @action
    init(): void {
        // Force disconnect
        if (this.socket && this.socket.connected) this.socket.disconnect();
        // Create new socket
        this.socket = io(this.url, {
            ...this.opts,
            auth: { token: this.token },
        });
        this.socket.on('connect', () => {
            this.setConnected(true);
        });
        this.socket.on('disconnect', () => {
            this.setConnected(false);
        });
        this.registerListeners();
    }

    @action
    private setConnected(connected: boolean): void {
        this.isConnected = connected;
    }
    @action
    setURL(url): void {
        this.url = url;
    }

    @action
    setToken(token): void {
        this.token = token;
    }

    @action
    setHost(host): void {
        this.host = host;
    }

    @action
    connect(): void {
        this.socket?.connect();
    }

    @action
    close(): void {
        this.socket.disconnect();
        // this.socket.off('connect');
        // this.socket.off('disconnect');
    }
}
