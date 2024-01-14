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
    <div className="bg-gradient-to-r from-[#FFCF00] via-[#FF3A00] to-[#00EDFF] p-0.5 rounded-[11px]">
      <div
        className="!bg-superbowlBg !relative !w-full sm:!w-fit flex items-center justify-center
        md:!px-4 !h-auto !rounded-[10px] !z-50"
      >
        <WalletMultiButton
          className="!w-full md:!w-fit !flex !justify-center hover:!bg-transparent"
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
      </div>
    </div>
  );
};

export default ConnectButton;
