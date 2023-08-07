import { FC } from "react";
import { GameStatus } from "../templates/ClassicView";
import { GameInfo } from "@/types";
import { Timer, VerifiedBadge } from "@/components";
import Image from "next/image";

interface Props {
  gameStatus: GameStatus;
  gameData: GameInfo;
}

const GameMetadata: FC<Props> = ({ gameStatus, gameData }) => {
  const Divider = <div className="w-[1px] h-9 bg-[#A89FA8]" />;
  return (
    <div className="w-fit mx-auto flex items-center gap-4 mt-5">
      {/* TODO: add creator here */}
      <div className="flex items-center gap-1">
        <VerifiedBadge />
        <p className="uppercase text-lg">degen picks team</p>
      </div>
      {gameStatus !== GameStatus.PREGAME && (
        <div className="flex items-center gap-4">
          {Divider}
          <Timer
            status={gameData.gameInfo.status}
            gameTime={gameData.gameInfo.gameDate}
          />
        </div>
      )}
      <div className="flex items-center gap-2">
        {Divider}
        {/* TODO: add other currencies */}
        <Image
          src="/images/icons/dust_square2.png"
          width={30}
          height={30}
          alt="currency"
        />
        <p className="text-lg">DUST</p>
      </div>
    </div>
  );
};

export default GameMetadata;
