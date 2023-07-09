import { generalConfig } from "@/configs";
import { Pickem, Wager } from "@/types";

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
    return stats.data;
  } catch (err) {
    return null;
  }
}

export async function getAssets() {
  try {
    const response = await fetch(`${generalConfig.apiUrl}/api/assets`);
    const assets = await response.json();
    return assets.data;
  } catch (err) {
    return null;
  }
}
