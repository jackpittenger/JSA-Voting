import { Params, Query } from "./post";
import { Token } from "./jwt";
import { Room } from "@prisma/client";

export interface RoomGetBody {
  _token: Token;
}

export interface RoomPostBody {
  name: string;
  _token: Token;
}

export interface RoomListBody {
  _token: Token;
  search: string;
}

export interface RoomListParams extends Params {
  convention: string;
  per: string;
  page: string;
}

export interface RoomListQuery extends Query {
  search: string;
}

export interface RoomGetParams extends Params {
  id: string;
}

export interface RoomIdBody {
  _token: Token;
  _id: number;
  room: Room;
}

export interface ConventionRoomBody {
  _token: Token;
  _id: number;
  id: string;
  room: Room;
}

export interface RoomSpeakerPostBody {
  _token: Token;
  _id: number;
  room: Room;
  name: string;
}

export interface RoomSpeakerDeleteBody {
  _token: Token;
  _id: number;
  room: Room;
  name: string;
}

export interface RoomBylineUpdate {
  _token: Token;
  _id: number;
  id: string;
  room: Room;
  byline: string;
}
