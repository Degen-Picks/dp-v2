import { generalConfig } from "@/configs";
import { LeaguesArray, Pickem, Wager, Stats, WagerUser } from "@/types";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { handleWalletLogin } from "../walletUtils";
import { LeaderboardData } from "@/types/LeaderboardData";

export async function getWagers() {
  try {
    const response = await fetch(`${generalConfig.apiUrl}/api/wagers`);
    const wagers: Wager[] = await response.json();
    return wagers;
  } catch (err) {
    return null;
  }
}

export async function getPickems() {
  try {
    const response = await fetch(`${generalConfig.apiUrl}/api/picks`);
    const pickems: Pickem[] = await response.json();
    return pickems;
  } catch (err) {
    return null;
  }
}

export async function getStats() {
  try {
    const response = await fetch(`${generalConfig.apiUrl}/api/stats`);
    const stats = await response.json();
    return stats.data as Stats;
  } catch (err) {
    return null;
  }
}

export async function getAssets() {
  try {
    const response = await fetch(`${generalConfig.apiUrl}/api/assets`);
    const assets = await response.json();
    return assets.data as LeaguesArray;
  } catch (err) {
    return null;
  }
}

export async function getLeaderboard() {
  try {
    const response = await fetch(`${generalConfig.apiUrl}/api/leaderboard`);
    const leaderboard = await response.json();
    return leaderboard.data as LeaderboardData;
  } catch (err) {
    return null;
  }
}

export async function getLoginStatus(): Promise<WagerUser | null> {
  try {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const requestOptions: RequestInit = {
      method: "GET",
      headers: headers,
      credentials: "include",
    };

    const response = await fetch(
      `${generalConfig.apiUrl}/api/status`,
      requestOptions
    );

    const body = await response.json();
    const { success } = body;

    if (!success) return null;

    return body.user;
  } catch {
    return null;
  }
}

export async function confirmSignature(
  publicKey: string,
  signedMessage: string
): Promise<WagerUser | null> {
  try {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const requestOptions: RequestInit = {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ publicKey, signedMessage }),
      credentials: "include",
    };

    const response = await fetch(
      `${generalConfig.apiUrl}/api/login`,
      requestOptions
    );

    const body = await response.json();
    const { success } = body;

    if (!success) return null;

    return body.user;
  } catch {
    return null;
  }
}

export async function login(wallet: WalletContextState): Promise<WagerUser | null> {
  const loggedInUser = await getLoginStatus();
  
  if (loggedInUser) return loggedInUser;

  const loginWithWallet = await handleWalletLogin(wallet);

  return loginWithWallet;
}

export async function logout() {
  try {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const requestOptions: RequestInit = {
      method: "POST",
      headers: headers,
      credentials: "include",
    };

    const response = await fetch(
      `${generalConfig.apiUrl}/api/logout`,
      requestOptions
    );

    const body = await response.json();
    return body;
  } catch {
    return null;
  }
}

export async function fetchNonce(publicKey: string): Promise<string> {
  try {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const requestOptions = {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ publicKey }),
    };

    const response = await fetch(
      `${generalConfig.apiUrl}/api/generateNonce`,
      requestOptions
    );

    const body = await response.json();
    return body.nonce;
  } catch {
    return "";
  }
}
