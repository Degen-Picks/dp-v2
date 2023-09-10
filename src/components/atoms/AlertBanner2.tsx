import { smallClickAnimation } from "@/configs";
import { useWallet } from "@solana/wallet-adapter-react";
import { FC } from "react";

const AlertBanner2: FC = () => {
  const { publicKey } = useWallet();

  if (!publicKey) return null;

  return (
    <div
      className="w-full min-h-[60px] px-5 md:px-0 py-2.5 md:py-0 bg-[#FECE00]
      flex flex-col md:flex-row items-center justify-center gap-2.5 md:gap-5 text-center"
    >
      <p className="text-lg leading-[19px] px-6 sm:px-0">
        When the game is over, set the winner and deploy airdrops to get paid.
      </p>
    </div>
  );
};

export default AlertBanner2;
