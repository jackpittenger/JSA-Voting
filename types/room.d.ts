import { Params } from "./post";
import { Token } from "./jwt";

export interface RoomGetBody {
  _token: Token;
}

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

export interface RoomGetParams extends Params {
  id: string;
}

export interface RoomPatchBody {
  _token: Token;
  id: string;
}
