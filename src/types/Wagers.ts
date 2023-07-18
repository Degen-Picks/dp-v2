export interface Wager {
  finalScore: string;
  league: string;
  _id: string;
  title: string;
  status: string;
  selections: Selection[];
  startDate: number;
  endDate: number;
  gameDate: number;
  metadata: any[];
  description: string;
}

export interface Selection {
  title: string;
  totalUsers: number;
  totalSpent: number;
  winner: boolean;
  publicKey: string;
  imageUrl: string;
  winnerImageUrl: string;
  nftImageUrl: string;
  _id: string;
}
