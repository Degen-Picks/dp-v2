export interface Pickem {
  _id: string;
  title: string;
  description: string;
  publicKey: string;
  entryFee: number;
  totalUsers: number;
  totalSpent: number;
  status: string;
  startDate: number;
  endDate: number;
  selections: PickemSelection[];
}

export interface PickemSelection {
  matchId: number;
  teams: PickemTeam[];
  gameDate: number;
  _id: string;
  totalScore: number;
  isTiebreaker?: boolean;
}

export interface PickemTeam {
  name: string;
  record: string;
  imageUrl: string;
  winner: boolean;
  _id: string;
  finalScore: number;
}
