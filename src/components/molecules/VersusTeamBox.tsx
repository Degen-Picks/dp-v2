import { FC } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { GameInfo } from "@/types";
import { GameStatus } from "../templates/ClassicView";

interface TProps {
  gameData: GameInfo;
  active: boolean;
  teamImg?: string;
  teamName: string;
  teamRecord?: string;
  valid: boolean;
  success: boolean;
  finalWinner: boolean;
  onClick: () => void;
}

const VersusTeamBox: FC<TProps> = ({
  gameData,
  active,
  teamImg,
  teamName,
  teamRecord,
  valid,
  success,
  finalWinner,
  onClick,
}) => {
  // states:
  // 1. you haven't put a pick in yet and you set this pick to active = purple
  // 2. you haven't put a pick in yet and this pick is inactive (has not been clicked) = light grey
  // 3. you HAVE put a pick in and it was this one = dark grey
  // 4. you HAVE put a pick in and it was NOT this one = light grey
  // 5. you HAVE put a pick in and it was this one AND it was correct = green
  // 6. you HAVE put a pick in and it was this one AND it was incorrect = red
  const handleStyles = () => {
    if (!success) {
      // no pick submitted
      if (active) {
        // and you selected this one
        return "border-purple1 bg-purple1/5";
      } else {
        // default style
        return "border-greyscale2 bg-greyscale2 hover:border-greyscale3 hover:bg-greyscale3";
      }
    } else {
      // pick submitted
      if (active) {
        // and you selected this one
        if (gameData.gameInfo.status === GameStatus.AIRDROPPED) {
          // and the winner has been set
          if (finalWinner) {
            // and it is the winner
            return "border-correct bg-[#E8F5E9]";
          } else {
            // and it is the loser
            return "border-incorrect bg-[#FFEBEE]";
          }
        } else {
          // and the winner has not been set
          return "border-greyscale4 bg-greyscale3";
        }
      } else {
        // and you did not select this one
        return "border-greyscale2 bg-greyscale2";
      }
    }
  };

  return (
    <motion.button
      className={`sm:w-[249px] w-1/2 border-2 ${handleStyles()} 
      ${teamImg === "" ? "h-[50px]" : "h-[90px]"} 
      py-3 sm:py-0 sm:px-0 hover:cursor-pointer
      ${!valid && "sm:hover:cursor-not-allowed"}`}
      onClick={onClick}
    >
      <div className="flex flex-col text-center h-full items-center justify-center w-fit mx-auto">
        {teamImg && teamImg !== "" && (
          <Image
            src={teamImg}
            width={30}
            height={30}
            alt={`${teamName} logo`}
            className="flex items-center justify-center"
          />
        )}
        <div>
          <div className={` text-center text-lg`}>{teamName}</div>
          {teamRecord !== "" && (
            <div className={`text-greyscale4 text-base leading-none`}>
              {teamRecord}
            </div>
          )}
        </div>
      </div>
    </motion.button>
  );
};

export default VersusTeamBox;
