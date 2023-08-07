import { FC } from "react";
import { GameMetadata } from "@/components";
import { GameInfo } from "@/types";
import { GameStatus } from "../templates/ClassicView";

interface Props {
  gameStatus: GameStatus;
  gameData: GameInfo;
}

const ClassicHero: FC<Props> = ({ gameData, gameStatus }) => {
  return (
    <div>
      <div className="w-fit max-w-[480px] mx-auto mb-8">
        <div className="font-base text-center text-lg">
          {gameData.gameInfo.description}
        </div>
        <div className="font-base-b text-center text-[32px] leading-[33px] text-black">
          {gameData.gameInfo.title}
        </div>
      </div>
      <GameMetadata gameStatus={gameStatus} gameData={gameData} />
    </div>
  );
};

export default ClassicHero;
