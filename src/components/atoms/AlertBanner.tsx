import { smallClickAnimation } from "@/configs";
import { useWallet } from "@solana/wallet-adapter-react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { FC } from "react";

interface Props {
  text: string;
  ctaText?: string;
  ctaLink?: string;
}

const AlertBanner: FC<Props> = ({ text, ctaLink, ctaText }) => {
  const router = useRouter();
  const { publicKey } = useWallet();

  if (!publicKey) return null;

  return (
    <div
      className="w-full md:h-[60px] px-5 md:px-0 py-2.5 md:py-0 bg-[#FECE00] 
      flex flex-col md:flex-row items-center justify-center
      gap-2.5 md:gap-5 text-center"
    >
      <p className="text-lg  leading-[19px] px-6 sm:px-0">{text} </p>
      <motion.button
        className="bg-greyscale1 h-10 w-32 flex items-center justify-center
        border border-transparent hover:border-greyscale5"
        onClick={() => router.push("/gamesetup")}
      >
        Create game
      </motion.button>
    </div>
  );
};

export default AlertBanner;
