import { FC } from "react";
import { BackButton, GameMetadata } from "@/components";
import { GameInfo } from "@/types";
import { GameStatus } from "../templates/ClassicView";

interface Props {
  gameStatus: GameStatus;
  gameData: GameInfo;
}

const ClassicHero: FC<Props> = ({ gameData, gameStatus }) => {
  return (
    <div className="w-full max-w-[620px] mx-auto mb-8">
      <BackButton text="All games" route="/classic" />
      <div className="w-full max-w-[480px] mx-auto pt-3">
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
