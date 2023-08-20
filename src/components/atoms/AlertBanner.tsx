import { smallClickAnimation } from "@/configs";
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

  return (
    <div className="w-full h-[60px] bg-[#FECE00] flex items-center justify-center gap-5 text-center">
      <p className="text-lg text-primary leading-[19px] px-6 sm:px-0">
        {text}{" "}
      </p>
      <motion.button
        {...smallClickAnimation}
        className="bg-white h-10 w-32 flex items-center justify-center"
        onClick={() => router.push("/classic/gamesetup")}
      >
        Create game
      </motion.button>
    </div>
  );
};

export default AlertBanner;
