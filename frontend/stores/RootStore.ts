
import { WebSocketStore } from './WebSocketStore';
import { PlayerStore } from './PlayerStore';
export type RootStoreHydration = any;

export class RootStore {


  webSocketStore: WebSocketStore;
  playerStore: PlayerStore;

  constructor() {

    this.playerStore = new PlayerStore(this);
    this.webSocketStore = new WebSocketStore(this);
  }
  // eslint-disable-next-line
  hydrate(initialData: RootStoreHydration) {
    console.log(initialData);
  }
}

export default RootStore;
