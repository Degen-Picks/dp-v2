import { FC } from "react";
import Image from "next/image";
import { Activity } from "../../types/GameInfo";
import { FallbackImage } from "@/components";

interface Props {
  item: Activity;
}

const ActivityItem: FC<Props> = ({ item }) => {
  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return Math.floor(seconds / 60) + "m ago";
    if (seconds < 86400) return Math.floor(seconds / 3600) + "h ago";
    if (seconds < 604800) return Math.floor(seconds / 86400) + "d ago";
    return Math.floor(seconds / 604800) + "w ago";
  };

  return (
    <div className="w-full flex item-center justify-between bg-white max-w-[620px] mx-auto px-10 py-4">
      <div className="flex items-center gap-3">
        {item.twitterName ? (
          <a
            href={`https://twitter.com/${item.twitterName}`}
            target="_blank"
            rel="noreferrer"
          >
            <div
              className="border border-light bg-light flex items-center justify-center 
              rounded-full w-[40px] h-[40px] overflow-hidden hover:scale-110 
              transition-transform ease-in-out duration-500"
            >
              <FallbackImage
                src={item.userImage}
                fallbackSrc={"/images/icons/user-alt.svg"}
                width={45}
                height={45}
                alt="user image"
              />
            </div>
          </a>
        ) : (
          <div className="border border-light bg-light flex items-center justify-center rounded-full w-[40px] h-[40px] overflow-hidden">
            <Image
              src={item.userImage}
              width={20}
              height={20}
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
              className="font-base-b hover:text-linkHover 
              transition-colors ease-in-out duration-300"
            >
              {item.name}
            </a>
          ) : (
            <p className="font-base-b">{item.name}</p>
          )}
          <p className="text-sm text-secondary">{timeAgo(item.time)}</p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <p>{item.teamName}</p>
        {/* round to whole numbers */}
        <p className="text-sm">{Math.ceil(item.dustBet * 100) / 100} DUST</p>
      </div>
    </div>
  );
};

export default ActivityItem;
