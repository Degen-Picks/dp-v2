import { generalConfig } from "@/configs";
import { PublicKey } from "@solana/web3.js";

export type SplToken = "DUST" | "USDC" | "CROWN";
export type Token = 'SOL' | SplToken;

type TokenDetails = {
    publicKey: PublicKey;
    decimals: number;
    minimum: number;
};

export const TOKEN_MAP: Record<SplToken, TokenDetails> = generalConfig.useDevNet ? {
    DUST: {
        publicKey: new PublicKey("DUSTcnwRpZjhds1tLY2NpcvVTmKL6JJERD9T274LcqCr"),
        decimals: 9,
        minimum: 1
    },
    USDC: {
        publicKey: new PublicKey("94Ab85gYry4raFhHsLbVJK7W7iR4cS8jyeFr7oZQcgAA"),
        decimals: 6,
        minimum: 1
    },
    CROWN: {
        publicKey: new PublicKey(""),
        decimals: -1,
        minimum: 1
      }
} : {
    DUST: {
        publicKey: new PublicKey("DUSTawucrTsGU8hcqRdHDCbuYhCPADMLM2VcCb8VnFnQ"),
        decimals: 9,
        minimum: 1
    },
    USDC: {
        publicKey: new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
        decimals: 6,
        minimum: 1
    },
    CROWN: {
        publicKey: new PublicKey("GDfnEsia2WLAW5t8yx2X5j2mkfA74i5kwGdDuZHt7XmG"),
        decimals: 9,
        minimum: 1
    }
};