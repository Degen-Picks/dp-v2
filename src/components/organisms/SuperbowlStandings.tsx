import { FC, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Pickem } from "@/types";
import { generalConfig } from "@/configs";
import SuperbowlLeaderboardItem from "../atoms/SuperbowlLeaderboardItem";

type Amount = {
  amount: number;
  signature: string;
  _id: string;
};

type TransferData = {
  error: number;
  _id: string;
};

type SuperbowlLeaderboardEntry = {
  publicKey: string;
  pickedTeams: string[];
  tieBreaker: number;
  tieBreakerPoints: number;
  nickname: string;
  winAmount: number;
  amounts: Amount[];
  transferData: TransferData;
  points: number;
  _id: string;
};

type SuperbowlLeaderboard = SuperbowlLeaderboardEntry[];


interface Props {
  currentPick: Pickem | null;
}

const SuperbowlStandings: FC<Props> = ({ currentPick }) => {
  const [leaderboard, setLeaderboard] = useState<SuperbowlLeaderboard | null>(null);

  useEffect(() => {
    if(!currentPick) return;

    loadLeaderboard(currentPick);
  }, [currentPick]);

  const loadLeaderboard = async (pick: Pickem) => {
    try {
      const headers = new Headers();
      headers.append("Content-Type", "application/json");

      const requestOptions = {
        method: "GET",
        headers: headers,
      };

      const response = await fetch(
        `${generalConfig.apiUrl}/api/leaderboard_pickem?pickId=${pick._id}`,
        requestOptions
      );
      const body = await response.json();

      if (response.status === 200 && body.data.length >= 1) {
        const leaderboard = body.data;
        setLeaderboard(leaderboard);
      }
    } catch (err) {
      console.log(`Error loading user pick ${err}`);
    }
  }

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
