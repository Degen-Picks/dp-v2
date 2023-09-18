import { Token } from "./Token";
import { WagerUser } from "./Wagers";

export interface Activity {
  id: number;
  name: string;
  time: Date;
  dustBet: number;
  teamImage: string;
  teamName: string;
  userImage: string;
  twitterName?: string;
  signature: string;
}

export interface GameInfo {
  gameInfo: GameInfoClass;
  team1: Team;
  team2: Team;
}

export interface GameInfoClass {
  description: string;
  endDate: number;
  finalScore: string;
  gameDate: number;
  league: string;
  metadata?: any;
  // selections: any[];
  startDate: number;
  status: string;
  title: string;
  creator?: WagerUser | null;
  dateStr: string;
  timeStr: string;
  dayTime: string;
  id: string;
  token: Token | null;
}

export interface Team {
  teamName: string;
  teamLogo: string;
  winnerImageUrl: string;
  nftImageUrl: string;
  dustVol: number;
  uniqueWallets: number;
  publicKey: string;
  id: string;
  record: string;
  winner?: boolean;
}
