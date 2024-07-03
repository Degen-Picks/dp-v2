import { WagerUser } from "./Wagers";

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

export interface BetEvent {
  _id: string;
  user: WagerUser;
  event: 'win' | 'placeBet' | 'testevnet' | 'event';
  amount: number;
  selection: string;
  timestamp: string;
  __v: number;
}

export type BetEventResponse = BetEvent[];