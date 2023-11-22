export interface Volume {
  token: string;
  amount: number;
  _id: string;
}

export interface StatsDetails {
  gamesHosted: number;
  uniquePlayers: number;
  totalPicks: number;
  totalVolume: Volume[];
  _id: string;
}

export interface Stats {
  _id?: string;
  live: StatsDetails;
  total: StatsDetails;
  __v?: number;
}
