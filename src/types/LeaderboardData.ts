import { WagerUser } from "./Wagers";

export interface LeaderboardData {
  hottestPool: WagerUser;
  craziestUpset: WagerUser;
  mostWins: WagerUser;
  mostGamesPlayed: WagerUser;
  highestWinStreak: WagerUser;
  mostCreations: WagerUser;
  users: WagerUser[];
}
