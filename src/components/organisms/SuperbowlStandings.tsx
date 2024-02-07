import { FC, useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import SuperbowlLeaderboardItem from "../atoms/SuperbowlLeaderboardItem";
import {
  SuperbowlLeaderboard,
  SuperbowlLeaderboardEntry,
} from "@/types/Superbowl";
import InfoModal from "./InfoModal";
import { Pickem } from "@/types";
import { getProfileImageFromDeID, getUsernameFromDeID } from "@/utils";
import Confetti from "react-confetti";
import { useWindowSize } from "@/hooks/useWindowSize";

interface Props {
  leaderboard: SuperbowlLeaderboard | null;
  currentPick: Pickem | null;
  celebrateSubmit: boolean;
}

const SuperbowlStandings: FC<Props> = ({
  leaderboard,
  currentPick,
  celebrateSubmit,
}) => {
  const [selectedEntry, setSelectedEntry] =
    useState<SuperbowlLeaderboardEntry | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [numPicksSet, setNumPicksSet] = useState<number>(0);

  const [width, height] = useWindowSize();

  useEffect(() => {
    if (currentPick) {
      setNumPicksSet(
        currentPick.selections.filter((selection) =>
          selection.teams.some((team) => team.winner === true)
        ).length
      );
    }
  }, [currentPick]);

  return (
    <>
      {celebrateSubmit ? (
        <Confetti
          width={width}
          height={1.6 * height}
          recycle={false}
          numberOfPieces={400}
          tweenDuration={10000}
        />
      ) : null}
      <motion.div
        className="w-full h-full flex flex-col flex-1 items-center px-5 pb-20 md:px-0 md:py-20"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="w-full flex flex-col gap-2.5 items-center py-10 md:pt-0">
          {leaderboard &&
            leaderboard.map((entry, index) => {
              return (
                <SuperbowlLeaderboardItem
                  key={entry._id}
                  rank={index + 1}
                  entry={entry}
                  setSelectedEntry={setSelectedEntry}
                  setShowModal={setShowModal}
                  numPicksSet={numPicksSet}
                />
              );
            })}
        </div>
      </motion.div>
      {leaderboard && currentPick && selectedEntry && showModal && (
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
                src={getProfileImageFromDeID(
                  selectedEntry.wagerUserDetails?.deidData!
                )}
                width={40}
                height={40}
                alt="user icon"
                className="rounded-full"
              />
              <p className="text-white">
                {getUsernameFromDeID(
                  selectedEntry.wagerUserDetails?.deidData!,
                  selectedEntry.publicKey
                )}
              </p>
            </div>
            <p className="text-center w-20 text-white pr-5 whitespace-nowrap">
              {selectedEntry.points} of {numPicksSet}
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5 p-5">
            {selectedEntry.pickedTeams.map((pickedTeamId, index) => {
              // Find the selection that contains the picked team
              const selection = currentPick.selections.find((selection) =>
                selection.teams.some((team) => team._id === pickedTeamId)
              );

              // Find the team details from the selection
              const teamDetails = selection?.teams.find(
                (team) => team._id === pickedTeamId
              );

              let styles = {
                borderColor: "#404040",
                borderWidth: "1px",
                borderStyle: "solid",
              };

              let textStyle = {
                color: "#808080",
              };

              if (selection && teamDetails) {
                const isWinnerSet = selection.teams.some(
                  (team) => team.winner === true
                );
                if (isWinnerSet) {
                  const didPlayerPickCorrectly = teamDetails.winner === true;
                  styles.borderColor = didPlayerPickCorrectly
                    ? "#1BCEA3"
                    : "#FF6B6B";
                  textStyle.color = didPlayerPickCorrectly
                    ? "#1BCEA3"
                    : "#FF6B6B";
                }
              }

              return (
                <div
                  key={index}
                  style={styles} // Apply styles here
                  className={`h-[50px] rounded-[20px] flex items-center justify-center px-5 py-2.5 ${
                    styles.borderColor === "inherit"
                      ? "border-foregroundDark"
                      : ""
                  }`}
                >
                  <p style={textStyle} className="text-foregroundMed">
                    {teamDetails ? teamDetails.name : "Team not found"}
                  </p>
                </div>
              );
            })}
          </div>
        </InfoModal>
      )}
    </>
  );
};

export default SuperbowlStandings;
