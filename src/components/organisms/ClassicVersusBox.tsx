import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { GameInfo } from "../../types/GameInfo";
import { GameStatus } from "../templates/ClassicView";
import { motion } from "framer-motion";
import { smallClickAnimation } from "@/configs";

interface TProps {
  active: boolean;
  teamImg?: string;
  teamName: string;
  teamRecord?: string;
  valid: boolean;
  success: boolean;
}

interface VProps {
  gameData: GameInfo;
  success: boolean;
  handlePicks: any;
  pickedTeams: any;
  valid: boolean;
  gameStatus: GameStatus;
  finalWinner: string | undefined;
  hideImage: boolean;
}

const TeamBox: FC<TProps> = ({
  active,
  teamImg,
  teamName,
  teamRecord,
  valid,
}) => (
  <motion.div
    {...smallClickAnimation}
    className={`sm:w-[249px] ${
      teamImg === "" ? "h-[50px]" : "h-[90px]"
    } py-3 sm:py-0 sm:px-0 hover:cursor-pointer\
    ${active ? "bg-[#6E17FF/10]" : "bg-versusBg"}
    ${!valid && "sm:hover:cursor-not-allowed"}
    `}
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
        <div className={`text-primary text-center text-lg`}>{teamName}</div>
        {teamRecord !== "" && (
          <div className={`text-secondary text-base leading-none`}>
            {teamRecord}
          </div>
        )}
      </div>
    </div>
  </motion.div>
);

const ClassicVersusBox: FC<VProps> = ({
  gameData,
  success,
  handlePicks,
  pickedTeams,
  valid,
  gameStatus,
  finalWinner,
  hideImage,
}) => {
  const [active1, setActive1] = useState<boolean>(false);
  const [active2, setActive2] = useState<boolean>(false);

  useEffect(() => {
    if (!success) return;

    if (pickedTeams.includes(gameData.team1.teamName)) {
      setActive1(true);
    } else if (pickedTeams.includes(gameData.team2.teamName)) {
      setActive2(true);
    }
  }, [pickedTeams]);

  return (
    <div className="w-full">
      <div className="w-full flex flex-row items-center justify-center relative">
        {/* left team */}
        <div
          // states:
          // 1. you haven't put a pick in yet and you set this pick to active = purple
          // 2. you haven't put a pick in yet and this pick is inactive (has not been clicked) = light grey
          // 3. you HAVE put a pick in and it was this one = dark grey
          // 4. you HAVE put a pick in and it was NOT this one = light grey
          // 5. you HAVE put a pick in and it was this one AND it was correct = green
          // 6. you HAVE put a pick in and it was this one AND it was incorrect = red
          className={`w-1/2 sm:w-auto border-2 ${
            !success
              ? active1
                ? "border-link bg-[rgba(110,23,255,0.1)]"
                : "border-transparent"
              : active1
              ? gameStatus === GameStatus.AIRDROPPED
                ? gameData.team1.winner
                  ? "border-correct !bg-[#E8F5E9]"
                  : "border-incorrect !bg-[#FFEBEE]"
                : "border-secondary !bg-border"
              : "border-transparent"
          }`}
          // 7 - results are in + correct + active1 = green (border-correct bg-[#E8F5E9])
          // 8 - results are in + incorrect + active1 = red (border-incorrect bg-[#FFEBEE])
          // 9 - results are in + not picked + finalWinner === team1 = green (border-correct bg-[#E8F5E9])

          onClick={() => {
            if (!success && valid) {
              if (active1) {
                setActive1(false);
                setActive2(false);
              } else {
                setActive1(true);
                setActive2(false);
              }

              // handlePicks(gameData.team1.teamName, id);
              handlePicks(1);
            }
          }}
        >
          <TeamBox
            active={active1}
            teamImg={!hideImage ? gameData.team1?.teamLogo : ""}
            teamName={gameData.team1.teamName}
            teamRecord={gameData.team1?.record}
            success={success}
            valid={valid}
          />
        </div>
        {/* right team */}
        <div
          className={`w-1/2 sm:w-auto border-2 ${
            !success
              ? active2
                ? "border-link bg-[rgba(110,23,255,0.1)]"
                : "border-transparent"
              : active2
              ? gameStatus === GameStatus.AIRDROPPED
                ? gameData.team2.winner
                  ? "border-correct !bg-[#E8F5E9]"
                  : "border-incorrect !bg-[#FFEBEE]"
                : "border-secondary !bg-border"
              : "border-transparent"
          }`}
          onClick={() => {
            if (!success && valid) {
              if (active2) {
                setActive2(false);
                setActive1(false);
              } else {
                setActive2(true);
                setActive1(false);
              }

              // handlePicks(gameData.team2.teamName, id);
              handlePicks(2);
            }
          }}
        >
          <TeamBox
            active={active2}
            teamImg={!hideImage ? gameData.team2.teamLogo : ""}
            teamName={gameData.team2.teamName}
            teamRecord={gameData.team2.record}
            success={success}
            valid={valid}
          />
        </div>
        {/* vs icon absolutely positioned */}
        <div
          className="absolute bg-white rounded-full w-[25px] h-[25px]
          left-1/2 -translate-x-1/2 text-center"
        >
          <p className="h-full flex items-center justify-center text-sm text-secondary">
            vs
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClassicVersusBox;
