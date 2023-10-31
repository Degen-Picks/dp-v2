import { TwitterData } from "./TwitterData";

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
  creator: WagerUser;
  description: string;
  token: string | null;
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

type Roles = Role[];
type Role = "ADMIN" | "CREATOR" | "DEFAULT";

interface Stats {
  totalWins: number;
  totalGamesCreated: number;
  totalGamesPlayed: number;
  totalGamesAirDropped: number;
  totalPoints: number;
  winStreak: number;
  longestWinStreak: number;
  _id: string;
}


export interface WagerUser {
  publicKey: string;
  twitterData: TwitterData | null;
  roles: Roles;
  stats: Stats;
};
