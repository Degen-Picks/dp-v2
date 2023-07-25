import { WalletContextState } from "@solana/wallet-adapter-react";
import { confirmSignature, fetchNonce } from "./adminApiUtil";

export const handleConfirmAction = async (wallet: WalletContextState, message: string): Promise<boolean> => {
    if (!wallet.signMessage || !wallet.publicKey) return false;
    try {
        const confirmed = await wallet.signMessage(Buffer.from(message));
        return true;
    } catch {
        return false;
    }
}

export const handleLogin = async (wallet: WalletContextState): Promise<boolean> => {
    if (!wallet.signMessage || !wallet.publicKey) return false;

    try {
        const nonce = await fetchNonce(wallet.publicKey.toString());

        if (nonce.length <= 0) return false;
    
        const tx = await wallet.signMessage(Buffer.from(nonce));
        const verified = await confirmSignature(
          wallet.publicKey.toString(),
          Buffer.from(tx).toString("hex")
        );
    
        return verified;
    } catch {
        return false;
    }
};