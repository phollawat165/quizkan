
import { WebSocketStore } from './WebSocketStore';

export type RootStoreHydration = any;

export class RootStore {


  webSocketStore: WebSocketStore;

  constructor() {

   
    this.webSocketStore = new WebSocketStore(this);
  }
  // eslint-disable-next-line
  hydrate(initialData: RootStoreHydration) {
    console.log(initialData);
  }
}

export default RootStore;
