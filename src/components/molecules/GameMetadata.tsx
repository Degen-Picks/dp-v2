import { FC, useEffect } from "react";
import { GameStatus } from "../templates/ClassicView";
import { GameInfo } from "@/types";
import { FallbackImage, Timer, VerifiedBadge } from "@/components";
import Image from "next/image";
import { motion } from "framer-motion";
import { smallClickAnimation } from "@/configs";

interface Props {
  gameStatus: GameStatus;
  gameData: GameInfo;
}

const GameMetadata: FC<Props> = ({ gameStatus, gameData }) => {
  const Divider = <div className="w-[1px] h-9 bg-[#A89FA8]" />;
  return (
    <div className="w-fit mx-auto flex items-center gap-4 mt-5">
      {gameData?.gameInfo?.creator?.roles?.includes("ADMIN") ? (
        <div className="flex items-center gap-1">
          <VerifiedBadge />
          <p className="uppercase">degen picks team</p>
        </div>
      ) : gameData?.gameInfo?.creator?.twitterData ? (
        <motion.button
          {...smallClickAnimation}
          className="flex items-center gap-2"
          onClick={() =>
            window.open(
              `https://twitter.com/${gameData?.gameInfo?.creator?.twitterData?.username}`
            )
          }
        >
          <FallbackImage
            src={gameData?.gameInfo?.creator.twitterData.profileImage}
            fallbackSrc={"/images/icons/user-alt.svg"}
            width={24}
            height={24}
            alt="user image"
          />
          <p>{gameData?.gameInfo?.creator?.twitterData?.username}</p>
        </motion.button>
      ) : null}

      {gameStatus !== GameStatus.PREGAME && (
        <div className="flex items-center gap-4">
          {Divider}
          <Timer
            status={gameData.gameInfo.status}
            gameTime={gameData.gameInfo.gameDate}
          />
        </div>
      )}
      <div className="flex items-center gap-4">
        {Divider}
        {/* TODO: add other currencies */}
        <div className="flex items-center gap-2">
          <Image
            src="/images/icons/dust_square2.png"
            width={30}
            height={30}
            alt="currency"
          />
          <p className="hidden sm:blocl text-lg">DUST</p>
        </div>
      </div>
    </div>
  );
};

export default GameMetadata;
