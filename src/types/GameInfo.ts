export interface Activity {
  id: number;
  name: string;
  time: Date;
  dustBet: number;
  teamImage: string;
  userImage: string;
  twitterName?: string;
}

export interface GameInfo {
  gameInfo: GameInfoClass;
  team1: Team;
  team2: Team;
}

export interface GameInfoClass {
  dateStr: string;
  timeStr: string;
  dayTime: string;
  status: string;
  id: string;
  title: string;
  description: string;
  league: string;
  finalScore: string;
  metadata?: any;
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
