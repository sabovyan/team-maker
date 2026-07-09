export type Player = {
  id: string;
  name: string;
  isEdit: boolean;
  draft: string;
};

export type Team = {
  id: string;
  name: string;
  score: number;
  isEdit: boolean;
  draft: string;
  players: Player[];
};

export type TeamsState = {
  numberOfGroups: number;
  maxScore: number | '';
  teams: Team[];
};
