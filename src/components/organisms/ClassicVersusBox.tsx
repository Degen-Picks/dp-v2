import { FC, useEffect, useState } from "react";
import { GameInfo } from "@/types";
import { GameStatus } from "@/components/templates/ClassicView";
import { VersusTeamBox } from "@/components";

interface VProps {
  gameData: GameInfo;
  success: boolean;
  handlePicks: any;
  pickedTeams: any;
  valid: boolean;
  gameStatus: GameStatus;

  hideImage: boolean;
}

const ClassicVersusBox: FC<VProps> = ({
  gameData,
  success,
  handlePicks,
  pickedTeams,
  valid,
  gameStatus,
  hideImage,
}) => {
  const [active1, setActive1] = useState<boolean>(false);
  const [active2, setActive2] = useState<boolean>(false);

  useEffect(() => {
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
        <VersusTeamBox
          gameData={gameData}
          active={active1}
          teamImg={!hideImage ? gameData.team1?.teamLogo : ""}
          teamName={gameData.team1.teamName}
          teamRecord={gameData.team1?.record}
          valid={valid}
          success={success}
          finalWinner={gameData.team1.winner || false}
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
        />
        {/* right team */}
        <VersusTeamBox
          gameData={gameData}
          active={active2}
          teamImg={!hideImage ? gameData.team2.teamLogo : ""}
          teamName={gameData.team2.teamName}
          teamRecord={gameData.team2.record}
          valid={valid}
          success={success}
          finalWinner={gameData.team2.winner || false}
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
        />
        {/* vs icon absolutely positioned */}
        <div
          className="absolute bg-greyscale1 rounded-full w-[25px] h-[25px]
          left-1/2 -translate-x-1/2 text-center"
        >
          <p className="h-full flex items-center justify-center text-sm">vs</p>
        </div>
      </div>
    </div>
  );
};

export default ClassicVersusBox;
