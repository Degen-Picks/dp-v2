import { FC } from "react";
import {
  WalletMultiButton,
  useWalletModal,
} from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import Image from "next/image";

interface Props {
  full?: boolean;
}

const ConnectButton: FC<Props> = ({ full = false }) => {
  const { publicKey, disconnect } = useWallet();
  const modal = useWalletModal();

  return (
    <div
      className={`border ${publicKey ? "border-foregroundDark" : "border-white"}
      bg-black text-white cursor-pointer ${
        full ? "w-full" : "w-auto"
      } flex items-center justify-center h-[50px] rounded-[20px] hover:bg-background2 group`}
    >
      {publicKey ? (
        <button
          onClick={() => disconnect()}
          className={`py-3 px-4 ${
            full ? "w-full" : "w-[160px]"
          } h-full flex items-center justify-center`}
        >
          <div className="flex items-center gap-2 group-hover:hidden">
            <Image
              src="/images/icons/phantom.png"
              width={18}
              height={18}
              alt="wallet icon"
            />
            <p className="font-figtree-semi text-base whitespace-nowrap">
              {publicKey.toBase58().slice(0, 4) +
                " ... " +
                publicKey.toBase58().slice(-4)}
            </p>
          </div>
          <p className="hidden group-hover:block">Disconnect</p>
        </button>
      ) : (
        <button
          onClick={() => modal.setVisible(true)}
          className="w-full py-3 px-4"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default ConnectButton;
