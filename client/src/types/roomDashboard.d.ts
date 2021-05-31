export type Room = {
  id: number;
  name: string;
  Voter: Voter[];
  speakers: string[];
  accessCode: string;
  open: boolean;
  votingOpen: boolean;
  byline: string;
  concluded: boolean;
  conventionId: number;
};

export type Voter = {
  id: string;
  firstName: string;
  lastName: string;
  school: string;
  vote: string;
  speaker: string;
};
