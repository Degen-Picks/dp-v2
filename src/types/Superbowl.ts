export type BinaryPick = 1 | 2 | null;

export type SuperbowlOption = {
  title: string;
  _id: string;
}

export type SuperbowlGameCard = {
  [key: string]: {
    title: string;
    answer: string | null;
    option1?: SuperbowlOption;
    option2?: SuperbowlOption;
  };
};

type Amount = {
  amount: number;
  signature: string;
  _id: string;
};

type TransferData = {
  error: number;
  _id: string;
};

type SuperbowlLeaderboardEntry = {
  publicKey: string;
  pickedTeams: string[];
  tieBreaker: number;
  tieBreakerPoints: number;
  nickname: string;
  winAmount: number;
  amounts: Amount[];
  transferData: TransferData;
  points: number;
  _id: string;
};

export type SuperbowlLeaderboard = SuperbowlLeaderboardEntry[];
