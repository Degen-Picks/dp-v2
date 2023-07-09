import { generalConfig } from "@/configs";

export const utilConfig = {
  cluster: "mainnet-beta",
  httpRPC: "https://cold-sparkling-darkness.solana-mainnet.quiknode.pro/",
  dustTokenAddress: "DUSTawucrTsGU8hcqRdHDCbuYhCPADMLM2VcCb8VnFnQ",
  defaultTimeout: 120000,
  dustDest: "F6c51jXFj9G3QJYDPv2TwNsZA5bK67f8icAWwE3i3Ad1",
};

utilConfig["cluster"] = generalConfig.useDevNet ? "devnet" : "mainnet-beta";
utilConfig["httpRPC"] = generalConfig.useDevNet
  ? "https://api.devnet.solana.com/"
  : "https://cold-sparkling-darkness.solana-mainnet.quiknode.pro/";
utilConfig["dustTokenAddress"] = generalConfig.useDevNet
  ? "DUSTcnwRpZjhds1tLY2NpcvVTmKL6JJERD9T274LcqCr"
  : "DUSTawucrTsGU8hcqRdHDCbuYhCPADMLM2VcCb8VnFnQ";
