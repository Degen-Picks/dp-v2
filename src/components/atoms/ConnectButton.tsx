import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { useContext, useEffect } from "react";
import { login, logout } from "@/utils";
import {
  WagerUserContext,
  WagerUserContextType,
} from "../stores/WagerUserStore";

const ConnectButton = () => {
  const { wagerUser, setWagerUser } = useContext(
    WagerUserContext
  ) as WagerUserContextType;

  const wallet = useWallet();
  const { publicKey } = wallet;

  return (
    <div
      className="!bg-black !relative !w-full sm:!w-fit flex items-center justify-center
        md:!px-0 !h-auto !rounded-none !z-50"
    >
      <WalletMultiButton
        className="!w-full md:!w-fit !flex !justify-center"
        // startIcon={undefined}
      >
        <p className="!font-base !text-lg !whitespace-nowrap">
          {publicKey
            ? publicKey.toBase58().slice(0, 4) +
              " ... " +
              publicKey.toBase58().slice(-4)
            : "Connect Wallet"}
        </p>
      </WalletMultiButton>
    </div>
  );
};

export default ConnectButton;
