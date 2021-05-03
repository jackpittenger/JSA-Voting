import { StateContext } from "./state";

export enum ActionType {
  ROOMS_OPEN = "Set rooms open",
  ROOMS_CLOSED = "Set rooms closed",
}

export type Action = { type: ActionType };
export const reducer = (state: StateContext, action: Action) => {
  switch (action.type) {
    case ActionType.ROOMS_OPEN:
      return { ...state, roomsOpen: true };
    case ActionType.ROOMS_CLOSED:
      return { ...state, roomsOpen: false };
    default:
      throw new Error("Not among actions");
  }
};
