import { WebSocketStore } from './WebSocketStore';
import { PlayerStore } from './PlayerStore';
import { HostStore } from './HostStore';
export type RootStoreHydration = any;

export class RootStore {
    webSocketStore: WebSocketStore;
    playerStore: PlayerStore;
    hostStore: HostStore;

    constructor() {
        this.playerStore = new PlayerStore(this);
        this.webSocketStore = new WebSocketStore(this);
        this.hostStore = new HostStore(this);
    }
    // eslint-disable-next-line
    hydrate(initialData: RootStoreHydration) {
        console.log(initialData);
    }
}

export default RootStore;
