import { FC } from "react";
import { motion } from "framer-motion";
import { smallClickAnimation } from "@/configs";
import Image from "next/image";

const TwitterShare: FC = () => {
  return (
    <motion.button
      className="border border-link rounded-full flex items-center justify-center gap-2 px-3 py-1"
      {...smallClickAnimation}
    >
      <Image
        src="/images/icons/x.png"
        width={20}
        height={20}
        alt="twitter icon"
      />
      <p className="text-link font-bold">Share</p>
    </motion.button>
  );
};

export default TwitterShare;
