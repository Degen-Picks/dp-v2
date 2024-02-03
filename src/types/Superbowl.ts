export type BinaryPick = 1 | 2 | null;

export type SuperbowlOption = {
  title: string;
  _id: string;
};

export type SuperbowlGameCard = {
  [key: string]: {
    title: string;
    answer: string | null;
    [key: `option${number}`]: SuperbowlOption;
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

export type SuperbowlLeaderboardEntry = {
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
