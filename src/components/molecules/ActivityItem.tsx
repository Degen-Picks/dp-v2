import { FC } from "react";
import Image from "next/image";
import { Activity, GameInfo } from "@/types";
import { FallbackImage, ExternalLink } from "@/components";
import { generalConfig } from "@/configs";

interface Props {
  item: Activity;
  gameData: GameInfo;
}

const ActivityItem: FC<Props> = ({ item, gameData }) => {
  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return Math.floor(seconds / 60) + "m ago";
    if (seconds < 86400) return Math.floor(seconds / 3600) + "h ago";
    if (seconds < 604800) return Math.floor(seconds / 86400) + "d ago";
    return Math.floor(seconds / 604800) + "w ago";
  };

  return (
    <div className="w-full flex item-center justify-between bg-greyscale1 max-w-[620px] mx-auto px-10 py-4">
      <div className="flex items-center gap-3">
        {item.twitterName ? (
          <a
            href={`https://twitter.com/${item.twitterName}`}
            target="_blank"
            rel="noreferrer"
          >
            <div
              className="border border-greyscale3 bg-greyscale3 flex items-center justify-center 
              rounded-full w-[40px] h-[40px] overflow-hidden"
            >
              <FallbackImage
                src={item.userImage}
                fallbackSrc={"/images/icons/user-alt.png"}
                width={45}
                height={45}
                alt="user image"
              />
            </div>
          </a>
        ) : (
          <div className="border border-greyscale3 bg-greyscale3 flex items-center justify-center rounded-full w-[40px] h-[40px] overflow-hidden">
            <Image
              src={item.userImage}
              width={45}
              height={45}
              alt="user image"
            />
          </div>
        )}

        <div className="flex flex-col items-start gap-1">
          {item.twitterName ? (
            <a
              href={`https://twitter.com/${item.twitterName}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-purple1 
              transition-colors ease-in-out duration-300"
            >
              {item.name}
            </a>
          ) : (
            <p>{item.name}</p>
          )}
          <p className="text-greyscale4 !text-base">{timeAgo(item.time)}</p>
        </div>
      </div>
      <div className="flex items-center gap-5">
        <div className="flex flex-col items-end gap-1">
          <p className="text-lg">{item.teamName}</p>
          {/* round to whole numbers */}
          <p className="!text-base">
            {Math.floor(item.dustBet * 100) / 100} {gameData.gameInfo.token}
          </p>
        </div>
        <a
          href={`https://explorer.solana.com/tx/${item.signature}${
            generalConfig.useDevNet ? "?cluster=devnet" : ""
          }`}
          target="_blank"
          rel="noreferrer noopener"
          className="p-2.5 -mr-5"
        >
          <ExternalLink
            width={14}
            height={14}
            className="fill-greyscale4 hover:fill-disabled"
          />
        </a>
      </div>
    </div>
  );
};

export default ActivityItem;
