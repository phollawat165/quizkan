import { ReactNode, createContext, useContext, ReactElement } from 'react';
import RootStore, { RootStoreHydration } from './RootStore';

// Define store singleton
let store: RootStore = null;
const isServer = typeof window === 'undefined';

// Store context
export const StoreContext = createContext<RootStore | undefined>(undefined);

// Root store hook
export function useRootStore(): RootStore {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useRootStore must be used within RootStoreProvider');
  }
  return context;
}

export type RootStoreProviderProps = {
  children: ReactNode;
  hydrationData?: RootStoreHydration;
};

// StoreContext wrapper component
export function RootStoreProvider({
  children,
  hydrationData,
}: RootStoreProviderProps): ReactElement {
  // initialize store
  const store = initializeStore(hydrationData);
  // provide root store to child components
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
}

// Initialze store
function initializeStore(initialData?: any): RootStore {
  const _store = store ?? new RootStore();

  if (initialData) {
    _store.hydrate(initialData);
  }
  // For SSG and SSR always create a new store
  if (isServer) return _store;
  // Create the store once in the client
  if (!store) store = _store;

  return _store;
}
