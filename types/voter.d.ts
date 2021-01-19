import type { Vote } from "@prisma/client";

export interface VoterPostBody {
  firstName: string;
  lastName: string;
  school: string;
  code: string;
}

export interface VotePostBody {
  vote: Vote;
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
