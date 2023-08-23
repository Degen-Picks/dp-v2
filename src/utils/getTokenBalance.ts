import { PublicKey } from "@solana/web3.js";
import { utilConfig } from "@/configs";
import { Connection } from "@metaplex/js";
import { SplToken, TOKEN_MAP, Token } from "@/types/Token";

function lamportsToSol(lamports: number): number {
  return lamports * 1e-9;
} 

export const getTokenBalance = async (
  publicKey: PublicKey,
  connection: Connection,
  token: Token
): Promise<number> => {
    if(token === "SOL") {
      return await getSOLTokenBalance(publicKey, connection);
    }

    return await getSplTokenBalance(publicKey, connection, token);
}

const getSOLTokenBalance = async (
  publicKey: PublicKey,
  connection: Connection
): Promise<number> => {
  try {
    const solBal = await connection.getBalance(publicKey);
    return (lamportsToSol(solBal));
  } catch (err) {
    console.log("Error getting sol token balance:", err);
    return 0;
  }
}

const getSplTokenBalance = async (
  publicKey: PublicKey,
  connection: Connection,
  token: SplToken
): Promise<number> => {
  return await connection
    .getParsedTokenAccountsByOwner(publicKey, {
      mint: TOKEN_MAP[token].publicKey,
    })
    .then((res: any) => {
      if (res?.value[0]?.account?.data?.parsed?.info?.tokenAmount?.uiAmount) {
        return parseFloat(
          res?.value[0]?.account?.data?.parsed?.info?.tokenAmount?.uiAmount
        );
      } else {
        return 0;
      }
    })
    .catch((err: any) => {
      console.log("Error getting spl token balance:", err);
      return 0;
    });
};

export default getTokenBalance;
