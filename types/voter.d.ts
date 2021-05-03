import type { Vote, Room } from "@prisma/client";
import type { Token } from "./jwt";

export interface VoterPostBody {
  firstName: string;
  lastName: string;
  school: string;
  code: string;
}

export interface VotePostBody {
  vote: Vote;
  _token: VoterToken;
}

export interface VoterToken {
  firstName: string;
  lastName: string;
  school: string;
  room: {
    name: string;
    accessCode: string;
  };
  iat: number;
  exp: number;
}

export interface SpeakerPostBody {
  speaker: string;
  _token: VoterToken;
}

export interface VoterDeleteBody {
  _token: Token;
  _id: number;
  room: Room;
  voterId: string;
}
