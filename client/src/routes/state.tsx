import React, { useContext, useReducer } from "react";
import { reducer, Action } from "./reducer";

export interface StateContext {
  roomsOpen: boolean;
}

export interface Store {
  state: StateContext;
  dispatch?: React.Dispatch<Action>;
}

const defaultState: StateContext = { roomsOpen: false };
const obj: Store = { state: defaultState };
const myContext = React.createContext(obj);

export const useStateContext = () => useContext(myContext);

type Props = {
  children: React.ReactNode;
};

export const StateProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(reducer, defaultState);
  return <myContext.Provider value={{ state, dispatch }} children={children} />;
};
