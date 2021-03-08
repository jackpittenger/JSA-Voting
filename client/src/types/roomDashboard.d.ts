export type Room = {
  id: number;
  Voter: Voter[];
  speakers: string[];
  accessCode: string;
  open: boolean;
  votingOpen: boolean;
  byline: string;
  conventionId: number;
};

export type Voter = {
  firstName: string;
  lastName: string;
  school: string;
  vote: string;
  speaker: string;
};
