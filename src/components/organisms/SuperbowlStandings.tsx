import { FC, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Pickem } from "@/types";
import { generalConfig } from "@/configs";
import SuperbowlLeaderboardItem from "../atoms/SuperbowlLeaderboardItem";
import { SuperbowlLeaderboard } from "@/types/Superbowl";

interface Props {
  leaderboard: SuperbowlLeaderboard | null;
}

const SuperbowlStandings: FC<Props> = ({ leaderboard }) => {
  return (
    <motion.div
      className="w-full h-full flex flex-col flex-1 gap-[60px] items-center justify-center"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="w-full flex flex-col gap-2.5 items-center">
        {leaderboard && leaderboard.map((entry) => (
          <SuperbowlLeaderboardItem
            key={entry._id}
            publicKey={entry.publicKey}
            points={entry.points}
            numSelections={entry.pickedTeams.length}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default SuperbowlStandings;
