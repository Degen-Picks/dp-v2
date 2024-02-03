import { FC } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const SuperbowlRules: FC = () => {
  return (
    <motion.div
      className="w-fit mx-auto h-full flex flex-col flex-1 gap-[60px] items-center justify-center"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <Image
        src="/images/icons/de[superbowl].svg"
        width={578}
        height={110}
        alt="Superbowl"
        className="px-8 pb-20 md:p-0"
      />
    </motion.div>
  );
};

export default SuperbowlRules;
