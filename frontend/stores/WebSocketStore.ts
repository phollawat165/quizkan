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

  @observable.deep
  socket?: Socket;

  @observable
  url: string;

  @observable
  isConnected: boolean;

  @observable
  messages: any[];

  @observable
  cookie: string;

  @observable
  opts: any;

  @observable
  host: boolean;

  @observable
  token: string;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.socket = null;
    this.cookie = null;
    this.isConnected = false;
    const urlObject = new URL(process.env.NEXT_PUBLIC_API_ENDPOINT);
    this.url = `ws://${urlObject.host}`;
    this.opts = {
      auth: {token: ''},
      transports: ['websocket']
    };
    this.messages = [];
    this.host = false;
    makeObservable(this);
    /*if (typeof window !== 'undefined') {
      this.init();
    }*/
  }

  @action
  init(): void {
    this.socket = io(this.url, {...this.opts, auth: {token: this.token}} );
    this.socket.on('connect', () => {
      this.setConnected(true);
    });
    this.socket.on('disconnect', () => {
      this.setConnected(false);
    });
    //this.registerListeners();
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
  registerListeners(): void {
    // Chat
    this.socket.on('recieve_message', (payload) => {
      this.addMessage(payload.message);
    });
  }

  @action
  registerListenersTest(): void {
    // Chat
    this.socket.on('msgToClient', (payload) => {
      this.addMessage(payload.message);
    });
  }

  @action
  addMessage(message: any): void {
    this.messages.push(message);
  }

  @action
  setCookie(cookie: any): void {
    this.cookie = cookie;
  }

  @action
  close(): void {
    this.socket.disconnect();
    this.socket.off('connect');
    this.socket.off('disconnect');
  }
}
