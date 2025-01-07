import React, {createContext, ReactElement, useContext} from 'react';
import {AppState} from '../mobx/app-state';

const app = new AppState();

type ProviderProps = {
  children: ReactElement;
};

export const AppStateContext = createContext<AppState>({} as AppState);

export const AppStateProvider = ({children}: ProviderProps) => {
  return (
    <AppStateContext.Provider value={app}>{children}</AppStateContext.Provider>
  );
};

export const useAppState = () => useContext(AppStateContext);
