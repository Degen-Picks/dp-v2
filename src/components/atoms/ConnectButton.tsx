import { FC } from "react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";

interface Props {
  full?: boolean;
}

const ConnectButton: FC<Props> = ({ full = false }) => {
  const { publicKey, disconnect } = useWallet();
  const modal = useWalletModal();

  return (
    <div className={`${!publicKey && "button-wrapper"} w-full`}>
      <button
        onClick={publicKey ? disconnect : () => modal.setVisible(true)}
        className={`group bg-[#1D1E26] text-white hover:bg-[#2C2D33] h-[50px] flex justify-center items-center ${
          full ? "w-full" : "w-auto max-w-[200px]"
        }
        rounded-[10px] px-[15px] py-2.5 gap-2 font-figtree`}
      >
        {publicKey ? (
          <>
            <p className="leading-6 truncate">
              {publicKey.toBase58().slice(0, 4) +
                " ... " +
                publicKey.toBase58().slice(-4)}
            </p>
          </>
        ) : (
          <span className="leading-6">Connect Wallet</span>
        )}
      </button>
    </div>
  );
};

export default ConnectButton;
