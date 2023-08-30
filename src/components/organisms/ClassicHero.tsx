import { FC } from "react";
import { BackButton, GameMetadata } from "@/components";
import { GameInfo } from "@/types";
import { GameStatus } from "../templates/ClassicView";
import { useRouter } from "next/router";
import { generalConfig } from "@/configs";

interface Props {
  gameStatus: GameStatus;
  gameData: GameInfo;
}

const ClassicHero: FC<Props> = ({ gameData, gameStatus }) => {
  const router = useRouter();
  return (
    <div className="w-full max-w-[620px] mx-auto mb-8">
      <BackButton
        text="All games"
        handleClick={() => router.push(generalConfig.appUrl)}
      />
      <div className="w-full max-w-[480px] mx-auto pt-3 flex flex-col items-center justify-center gap-2.5">
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
