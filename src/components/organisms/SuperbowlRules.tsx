import { FC } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Pickem } from "@/types";

interface Props {
  currentPick: Pickem | null;
}

const SuperbowlRules: FC<Props> = ({ currentPick }) => {
  return (
    <motion.div
      className="w-fit mx-auto min-h-[800px] sm:min-h-full h-full flex flex-col flex-1 gap-10 items-center justify-center pb-24 px-5 "
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
        width={780}
        height={325}
        alt="Superbowl"
        className="hidden lg:block px-8"
        priority
      />
      <Image
        src="/images/landing/superbowl_landing_mobile.png"
        width={700}
        height={744}
        alt="Superbowl"
        className="lg:hidden px-5"
        priority
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
              src="/images/icons/sol.png"
              width={16}
              height={16}
              alt="DUST"
            />
            <p className="text-white">Solana</p>
          </div>
        </div>
        <div className="hidden md:flex bg-background2 rounded-[20px] h-20 px-[60px] flex-col items-center justify-center gap-[5px]">
          <p className="text-foregroundMed">Dust in pool</p>
          <div className="flex items-center gap-[5px]">
            <Image
              src="/images/icons/dust_gold.png"
              width={16}
              height={16}
              alt="DUST"
            />
            <p className="text-primary">
              {currentPick?.totalSpent.toLocaleString() ?? 0}
            </p>
          </div>
        </div>
      </div>
      <div className="flex md:hidden bg-background2 rounded-[20px] h-20 px-[80px] flex-col items-center justify-center gap-[5px]">
        <p className="text-foregroundMed">Dust in pool</p>
        <div className="flex items-center gap-[5px]">
          <Image
            src="/images/icons/dust_gold.png"
            width={16}
            height={16}
            alt="DUST"
          />
          <p className="text-primary">
            {currentPick?.totalSpent.toLocaleString() ?? 0}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default SuperbowlRules;
