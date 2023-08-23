import { generalConfig } from "@/configs";
import { PublicKey } from "@solana/web3.js";

export type SplToken = "DUST" | "USDC";
export type Token = 'SOL' | SplToken;

type TokenDetails = {
    publicKey: PublicKey;
    decimals: number;
};

export const TOKEN_MAP: Record<SplToken, TokenDetails> = generalConfig.useDevNet ? {
    DUST: {
        publicKey: new PublicKey("DUSTcnwRpZjhds1tLY2NpcvVTmKL6JJERD9T274LcqCr"),
        decimals: 9
    },
    USDC: {
        publicKey: new PublicKey("AkDWDJ37DqhLN95TL467NFAPixDTq1L6iXLJ1Boqznr1"),
        decimals: 6
    }
} : {
    DUST: {
        publicKey: new PublicKey("DUSTawucrTsGU8hcqRdHDCbuYhCPADMLM2VcCb8VnFnQ"),
        decimals: 9
    },
    USDC: {
        publicKey: new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
        decimals: 6
    }
};