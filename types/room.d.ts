import { Token } from "./jwt";

export interface RoomPostBody {
  name: string;
  _token: Token;
}
