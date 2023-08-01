import { WalletContextState } from "@solana/wallet-adapter-react";
import { confirmSignature, fetchNonce } from "./api/apiUtil";
import { WagerUser } from "@/types";

export const handleConfirmAction = async (wallet: WalletContextState, message: string): Promise<boolean> => {
    if (!wallet.signMessage || !wallet.publicKey) return false;
    try {
        const confirmed = await wallet.signMessage(Buffer.from(message));
        return true;
    } catch {
        return false;
    }
}

export const handleWalletLogin = async (wallet: WalletContextState): Promise<WagerUser | null> => {
    if (!wallet.signMessage || !wallet.publicKey) return null;

    try {
        const nonce = await fetchNonce(wallet.publicKey.toString());

        if (nonce.length <= 0) return null;
    
        const tx = await wallet.signMessage(Buffer.from(nonce));
        const wagerUser = await confirmSignature(
          wallet.publicKey.toString(),
          Buffer.from(tx).toString("hex")
        );

        console.log("confirmed user", wagerUser)
    
        return wagerUser;   
    } catch {
        return null;
    }
};