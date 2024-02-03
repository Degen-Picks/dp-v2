import { FC, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import SuperbowlLeaderboardItem from "../atoms/SuperbowlLeaderboardItem";
import {
  SuperbowlLeaderboard,
  SuperbowlLeaderboardEntry,
} from "@/types/Superbowl";
import InfoModal from "./InfoModal";

interface Props {
  leaderboard: SuperbowlLeaderboard | null;
}

const SuperbowlStandings: FC<Props> = ({ leaderboard }) => {
  const [selectedEntry, setSelectedEntry] =
    useState<SuperbowlLeaderboardEntry | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <>
      <motion.div
        className="w-full h-full flex flex-col flex-1 items-center justify-center px-5 pb-20 md:px-0 md:py-20"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="w-full flex flex-col gap-2.5 items-center py-10 md:pt-0">
          {leaderboard &&
            leaderboard.map((entry, index) => (
              <SuperbowlLeaderboardItem
                key={entry._id}
                rank={index + 1}
                entry={entry}
                setSelectedEntry={setSelectedEntry}
                setShowModal={setShowModal}
              />
            ))}
        </div>
      </motion.div>
      {leaderboard && selectedEntry && showModal && (
        <InfoModal showModal={showModal} setShowModal={setShowModal}>
          <div
            className={`mt-[70px] w-full h-[72px] py-[15px] border-y border-foregroundDark 
            flex items-center gap-2.5`}
          >
            <p className="text-white text-center w-10 pl-5">
              {leaderboard.findIndex((item) => item._id === selectedEntry._id) +
                1 ?? -1}
            </p>
            <div className="w-full flex items-center gap-2.5">
              <Image
                src="/images/icons/user-alt.svg"
                width={40}
                height={40}
                alt="user icon"
              />
              <p className="text-white">
                {selectedEntry.publicKey.slice(0, 4) +
                  "..." +
                  selectedEntry.publicKey.slice(-4)}
              </p>
            </div>
            <p className="text-center w-20 text-white pr-5">
              {selectedEntry.points} of {selectedEntry.pickedTeams.length}
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5 p-5">
            {selectedEntry.pickedTeams.map((team, index) => (
              <div
                key={index}
                className="h-[50px] rounded-[20px] flex items-center justify-center px-5 py-2.5 border border-foregroundDark"
              >
                <p className={`text-foregroundMed`}>test</p>
              </div>
            ))}
          </div>
        </InfoModal>
      )}
    </>
  );
};

export default SuperbowlStandings;
