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
  selection1: string;
  selection1Record: string;
  selection1img: string;
  selection1winnerImg: string;
  selection1nftImg: string;
  selection2: string;
  selection2Record: string;
  selection2img: string;
  selection2winnerImg: string;
  selection2nftImg: string;
  startDate: number;
  endDate: number;
  gameDate: number;
  metadata: any[];
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
