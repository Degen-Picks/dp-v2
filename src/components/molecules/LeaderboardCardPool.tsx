import { FC } from "react";
import Image from "next/image";
import { GameInfo } from "@/types";
import { FallbackImage } from "@/components";

interface Props {
  gameData: GameInfo;
  title: string;
  dataTitle?: string;
}

const LeaderboardCardPool: FC<Props> = ({ gameData, title, dataTitle }) => {
  return (
    <div className="flex flex-col gap-2.5">
      <p>{title}</p>
      <div className="w-[300px] h-20 bg-greyscale1 flex items-center justify-between pl-5 py-2.5">
        <div className="flex flex-col">
          <p className="text-lg truncate">{gameData.gameInfo.title}</p>
          <div className="flex items-center gap-2">
            {gameData.gameInfo.creator &&
            gameData.gameInfo.creator.twitterData ? (
              <a
                href={`https://twitter.com/${gameData.gameInfo.creator.twitterData.username}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2"
              >
                <div className="rounded-full w-[40px] h-[40px] overflow-hidden">
                  <FallbackImage
                    src={gameData.gameInfo.creator.twitterData.profileImage}
                    fallbackSrc={"/images/icons/user-alt.png"}
                    width={40}
                    height={40}
                    alt="user image"
                  />
                </div>
                <p>{gameData.gameInfo.creator.twitterData.username}</p>
              </a>
            ) : (
              <>
                <Image
                  src="/images/icons/user-alt.png"
                  width={40}
                  height={40}
                  alt="user image"
                  className="rounded-full overflow-hidden"
                />
                <p>unknown</p>
              </>
            )}
          </div>
        </div>
        <div className="w-20 h-[60px] flex items-center justify-center border-l border-greyscale4/50">
          <div className="flex flex-col items-center justify-center">
            {/* <p className="text-lg">{user?.points}</p> */}
            <p className="text-lg leading-5">{69}</p>
            <p className="text-lg leading-5">{dataTitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardCardPool;
