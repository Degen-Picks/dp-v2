import { FC } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { GameStatus } from "../templates/ClassicView";
import { FallbackImage, Timer, VerifiedBadge } from "@/components";
import { GameInfo } from "@/types";
import { smallClickAnimation } from "@/configs";
import { getCurrencyIcon } from "@/utils";

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
          className="flex items-center gap-2 group"
          onClick={() =>
            window.open(
              `https://twitter.com/${gameData?.gameInfo?.creator?.twitterData?.username}`,
              "_blank",
              "noopener noreferrer"
            )
          }
        >
          <div className="border border-transparent rounded-full group-hover:border-purple1">
            <FallbackImage
              src={gameData?.gameInfo?.creator.twitterData.profileImage}
              fallbackSrc={"/images/icons/user-alt.png"}
              width={33}
              height={33}
              alt="user image"
            />
          </div>
          <p className="group-hover:text-purple1">
            {gameData?.gameInfo?.creator?.twitterData?.username}
          </p>
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
        <div className="flex items-center gap-2">
          <Image
            src={getCurrencyIcon(gameData?.gameInfo?.token)}
            width={24}
            height={24}
            alt="token icon"
          />
          <p className="hidden sm:block text-lg">
            {gameData?.gameInfo?.token ?? "DUST"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GameMetadata;
