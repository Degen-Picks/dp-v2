import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { PublicKey, LAMPORTS_PER_SOL, SystemProgram } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { sendTransactionWithRetryWithKeypair } from "@/utils";
import getOrCreateAssociatedTokenAccount from "../composables/getOrCreateAssociatedTokenAccount";
import createTransferInstruction from "../composables/createTransferInstructions";
import { utilConfig } from "@/configs";
import { Connection } from "@metaplex/js";
import { SplToken, TOKEN_MAP, Token } from "@/types/Token";

export function getTransferAmount(amount: number, token: Token) {
  if(token === 'SOL') {
      return Math.floor(amount * LAMPORTS_PER_SOL);
  }

  const decimals = TOKEN_MAP[token].decimals;
  return Math.floor(amount * Math.pow(10, decimals));
}

const sendTransaction = async (
  publicKey: PublicKey,
  signTransaction: any,
  connection: Connection,
  amount: number,
  dest: string,
  token: Token
) => {
  if(token === "SOL") {
    return await sendSOLTransaction(publicKey, signTransaction, connection, amount, dest);
  }

  return await sendSplTransaction(publicKey, signTransaction, connection, amount, dest, token);
}

const sendSOLTransaction = async (
  publicKey: PublicKey,
  signTransaction: any,
  connection: Connection,
  solAmount: number,
  solDest: string
) => {
  console.log("Processing transaction...");

  try {
    if (!publicKey || !signTransaction) throw new WalletNotConnectedError();

    const toPublicKey = new PublicKey(solDest);

    const instruction = SystemProgram.transfer({
      fromPubkey: publicKey,   // sender's public key
      toPubkey: toPublicKey,   // recipient's public key
      lamports: getTransferAmount(solAmount, "SOL")  // amount in lamports
    });

    const { txid, slot } = await sendTransactionWithRetryWithKeypair(
      connection,
      publicKey,
      [
        instruction,
      ],
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

const sendSplTransaction = async (
  publicKey: PublicKey,
  signTransaction: any,
  connection: Connection,
  amount: number,
  dest: string,
  token: SplToken
) => {
  console.log("Processing transaction...");

  try {
    if (!publicKey || !signTransaction) throw new WalletNotConnectedError();
    const toPublicKey = new PublicKey(dest);
    const mint = TOKEN_MAP[token].publicKey;

    const transferAmount = getTransferAmount(amount, token);

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
      transferAmount,
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

export default sendTransaction;
