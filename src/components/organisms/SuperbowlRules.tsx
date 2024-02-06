import { FC } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const SuperbowlRules: FC = () => {
  return (
    <motion.div
      className="w-fit mx-auto h-full flex flex-col flex-1 gap-10 items-center justify-center pb-20"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="flex flex-col items-center gap-2.5">
        <Image
          src="/images/icons/de[superbowl].svg"
          width={363}
          height={66}
          alt="Superbowl"
        />
        <p className="text-foregroundMed">
          A Pick&apos;em game built by Degen Picks.
        </p>
      </div>
      <Image
        src="/images/landing/superbowl_landing.png"
        width={620}
        height={260}
        alt="Superbowl"
      />
      <div className="flex items-center justify-center gap-5">
        <div className="flex flex-col items-center justify-center gap-[5px] w-[120px]">
          <p className="text-foregroundMed">Entry</p>
          <div className="flex items-center gap-[5px]">
            <Image
              src="/images/icons/dust.png"
              width={16}
              height={16}
              alt="DUST"
            />
            <p className="text-white">15 DUST</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-[5px] w-[120px]">
          <p className="text-foregroundMed">Only on</p>
          <div className="flex items-center gap-[5px]">
            <Image
              src="/images/icons/solana.png"
              width={16}
              height={16}
              alt="DUST"
            />
            <p className="text-white">Solana</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SuperbowlRules;
