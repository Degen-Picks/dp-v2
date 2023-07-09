import { PublicKey } from "@solana/web3.js";
import { utilConfig } from "@/configs";
import { Connection } from "@metaplex/js";

const getDustBalance = async (publicKey: PublicKey, connection: Connection) => {
  return await connection
    .getParsedTokenAccountsByOwner(publicKey, {
      mint: new PublicKey(utilConfig.dustTokenAddress),
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
      console.log("DUST ERROR:", err);
    });
};

export default getDustBalance;
