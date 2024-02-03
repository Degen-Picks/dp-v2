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
    <WalletMultiButton
      className="!w-full md:!w-fit !flex !justify-center hover:!bg-transparent !border !border-white/50"
      startIcon={undefined}
    >
      <p className="!font-figtree-semi !text-xl !whitespace-nowrap !text-white">
        {publicKey
          ? publicKey.toBase58().slice(0, 4) +
            " ... " +
            publicKey.toBase58().slice(-4)
          : "Connect Wallet"}
      </p>
    </WalletMultiButton>
  );
};

export default ConnectButton;
