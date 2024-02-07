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
      className="!bg-black !border !border-white !relative !w-full sm:!w-fit flex items-center justify-center
        md:!px-0 !h-auto !rounded-[20px] !z-50 !overflow-hidden"
    >
      <WalletMultiButton
        className="!w-full md:!w-fit !flex !justify-center !bg-inherit hover:!bg-black"
        // startIcon={undefined}
      >
        <p className="!font-figtree-semi !text-lg !whitespace-nowrap ">
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
