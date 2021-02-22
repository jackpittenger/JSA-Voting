import { Params } from "./post";
import { Token } from "./jwt";

export interface RoomPostBody {
  name: string;
  _token: Token;
}

export interface RoomListBody {
  _token: Token;
}

export interface RoomListParams extends Params {
  convention: string;
  per: string;
  page: string;
}
