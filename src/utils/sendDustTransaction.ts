import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { sendTransactionWithRetryWithKeypair } from "@/utils";
import getOrCreateAssociatedTokenAccount from "../composables/getOrCreateAssociatedTokenAccount";
import createTransferInstruction from "../composables/createTransferInstructions";
import { utilConfig } from "@/configs";
import { Connection } from "@metaplex/js";

const sendDustTransaction = async (
  publicKey: PublicKey,
  signTransaction: any,
  connection: Connection,
  dustAmount: number,
  dustDest: string
) => {
  console.log("Processing transaction...");

  try {
    if (!publicKey || !signTransaction) throw new WalletNotConnectedError();
    const toPublicKey = new PublicKey(dustDest);
    const mint = new PublicKey(utilConfig.dustTokenAddress);

    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      publicKey,
      mint,
      publicKey,
      signTransaction
    );

    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      publicKey,
      mint,
      toPublicKey,
      signTransaction
    );

    const transferInstruction = createTransferInstruction(
      fromTokenAccount.address, // source
      toTokenAccount.address, // dest
      publicKey,
      dustAmount * LAMPORTS_PER_SOL,
      [],
      TOKEN_PROGRAM_ID
    );

    const { txid, slot } = await sendTransactionWithRetryWithKeypair(
      connection,
      publicKey,
      [transferInstruction],
      signTransaction,
      "confirmed"
    );

    console.log("Transaction Confirmed:", txid, slot);

    return txid ?? null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default sendDustTransaction;
