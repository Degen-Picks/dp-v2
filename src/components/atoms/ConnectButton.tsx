import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import Image from "next/image";

const ConnectButton = () => {
  const { publicKey } = useWallet();

  return (
    <>
      <div className="sm:hidden">
        <WalletMultiButton
          className="!bg-black !relative !w-[60px] !h-[60px] !p-0 !rounded-none flex justify-center !z-50 !font-base"
          startIcon={undefined}
        >
          <Image
            src="/images/icons/wallet.svg"
            width={20}
            height={20}
            alt="wallet icon"
          />
        </WalletMultiButton>
      </div>
      <div className="hidden sm:block">
        <WalletMultiButton
          className="!bg-black !relative !w-auto md:!w-[168px] md:!px-0 !h-auto !rounded-none flex justify-center !z-50 !font-base"
          startIcon={undefined}
        >
          {publicKey
            ? publicKey.toBase58().slice(0, 4) +
              " ... " +
              publicKey.toBase58().slice(-4)
            : "Connect Wallet"}
        </WalletMultiButton>
      </div>
    </>
  );
};

export default ConnectButton;
