import { WagerUser } from "./Wagers";

export interface LeaderboardData {
    mostWins: WagerUser;
    mostGamesPlayed: WagerUser;
    highestWinStreak: WagerUser;
    mostCreations: WagerUser;
    users: WagerUser[];
}
