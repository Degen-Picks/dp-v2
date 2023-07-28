import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import Image from "next/image";

const ConnectButton = () => {
  const { publicKey } = useWallet();

  return (
    <>
      <div className="relative sm:hidden bg-black z-50">
        <WalletMultiButton
          className="!w-[60px] !h-[60px] !p-0 !rounded-none flex justify-center !font-base"
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
      <div
        className="hidden sm:block !bg-black !relative !w-full
        md:!px-0 !h-auto !rounded-none !z-50"
      >
        <WalletMultiButton
          className="!w-auto md:!w-[168px] !flex !justify-center"
          startIcon={undefined}
        >
          <p className="!font-base !text-base !whitespace-nowrap">
            {publicKey
              ? publicKey.toBase58().slice(0, 4) +
                " ... " +
                publicKey.toBase58().slice(-4)
              : "Connect Wallet"}
          </p>
        </WalletMultiButton>
      </div>
    </>
  );
};

export default ConnectButton;
