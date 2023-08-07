import { FC } from "react";
import { Twitter } from "@/components";
import { motion } from "framer-motion";
import { smallClickAnimation } from "@/configs";

const TwitterShare: FC = () => {
  return (
    <motion.button
      className="border border-link rounded-full flex items-center justify-center gap-2 px-3 py-1"
      {...smallClickAnimation}
    >
      <Twitter width={12} height={12} />
      <p className="text-link font-bold">Share</p>
    </motion.button>
  );
};

export default TwitterShare;
