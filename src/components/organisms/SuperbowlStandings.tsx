import { FC, useEffect, useState } from "react";
import { motion } from "framer-motion";
import SuperbowlPick from "../atoms/SuperbowlPick";
import { SuperbowlGameCard } from "@/types/Superbowl";
import { Pickem } from "@/types";
import { getPickems, sleep, updatePick } from "@/utils";
import sendTransaction from "@/utils/sendTransaction";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { generalConfig } from "@/configs";
import SuperbowlLeaderboardItem from "../atoms/SuperbowlLeaderboardItem";

interface Props {
  isAdmin?: boolean;
}

const SuperbowlStandings: FC<Props> = ({ isAdmin }) => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  return (
    <motion.div
      className="w-full h-full flex flex-col flex-1 gap-[60px] items-center justify-center"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="w-full flex flex-col gap-2.5 items-center">
        <SuperbowlLeaderboardItem />
        <SuperbowlLeaderboardItem />
        <SuperbowlLeaderboardItem />
        <SuperbowlLeaderboardItem />
      </div>
    </motion.div>
  );
};

export default SuperbowlStandings;
