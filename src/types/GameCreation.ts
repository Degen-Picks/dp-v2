export interface ClassicGameOptions {
  league: string;
  team1Name: string;
  team1Record?: string;
  team2Name: string;
  team2Record?: string;
  title: string;
  description?: string;
  gameTime: string;
  collection: string;
  token: string;
}

export type ClassicGameBody = {
  title: string;
  description: string;
  league: string;
  collectionName: string;
  selection1: string;
  selection1Record: string;
  selection2: string;
  selection2Record: string;
  gameDate: number;
  token: string;
};

export type ClassicGameCreateResponse = {
  statusCode: number;
  body: any;
};

export type TeamOption = {
  _id: string;
  name: string;
  imageUrl: string;
};

export type League = {
  _id: string;
  league: string;
  options: TeamOption[];
  __v: number;
};

export type LeaguesArray = League[];

export type ServerResponse = {
  success: boolean;
  message: string;
};
