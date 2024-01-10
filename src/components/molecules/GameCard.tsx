import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { FallbackImage, Timer } from "@/components";
import { Wager } from "@/types";
import { getCurrencyIcon } from "@/utils";

interface Props {
  game: Wager;
}

const GameCard: FC<Props> = ({ game }) => {
  const winningPercent = () => {
    const total = game.selections[0].totalSpent + game.selections[1].totalSpent;
    if (total === 0) return 0;
    const percent = Math.ceil((game.selections[0].totalSpent * 100) / total);
    return percent;
  };

  const getColor = (status: string, index: number) => {
    switch (status) {
      case "closed":
        return "bg-greyscale4";
      case "completed":
        if (!game.selections[index].winner) return "bg-white";
        else return "bg-correct";
      case "cancelled":
        return "bg-white";
      default:
        return "bg-purple1";
    }
  };

  if (!game) return null;

  return (
    <Link className="w-full" passHref href={`/${encodeURI(game._id)}`}>
      <div
        className="relative bg-greyscale1 h-auto md:h-[180px] w-full md:w-[620px] flex flex-col gap-1 justify-center
        px-[30px] py-[25px] mx-auto cursor-pointer border-2 border-transparent hover:border-purple1"
      >
        <p className="text-[22px] leading-[21px] font-base-b">{game.title}</p>
        <div className="flex flex-col">
          <div className="flex items-center gap-2.5">
            <div className="relative !w-[200px] sm:w-[300px] h-[9px]">
              <div
                className={`absolute w-full h-full transition-transform duration-500 ${getColor(
                  game.status,
                  0
                )}`}
                style={{
                  width: `${winningPercent()}%`,
                }}
              />
              <div
                className={`absolute w-full h-full border border-greyscale5
                ${
                  game.selections[0].winner
                    ? "bg-[#5CB85C59]"
                    : "bg-transparent"
                }`}
              />
            </div>
            <p className="w-[70px] sm:w-full text-base text-left truncate">
              {game.selections[0].title}
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="relative !w-[200px] sm:w-[300px] h-[9px]">
              <div
                className={`absolute w-full h-full transition-transform duration-500 ${getColor(
                  game.status,
                  1
                )}`}
                style={{
                  width: `${100 - winningPercent()}%`,
                  backgroundColor: "transparent",
                }}
              />
              <div
                className={`absolute w-full h-full border border-greyscale5
                ${
                  game.selections[1].winner
                    ? "bg-[#5CB85C59]"
                    : "bg-transparent"
                }`}
              />
            </div>
            <p className="w-[70px] sm:w-full text-base text-left truncate">
              {game.selections[1].title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {game.creator?.roles?.includes("ADMIN") ? (
            <div className="flex items-center gap-[5px]">
              <Image
                src="/images/team_icon.png"
                width={16}
                height={16}
                alt="dp team icon"
              />
              <p className="uppercase text-lg">dp team</p>
            </div>
          ) : game.creator?.twitterData ? (
            <div className="flex items-center gap-[5px]">
              <FallbackImage
                src={game.creator.twitterData.profileImage}
                fallbackSrc={"/images/icons/user-alt.png"}
                width={24}
                height={24}
                alt="user image"
              />
              <p className="text-lg">{game.creator?.twitterData?.username}</p>
            </div>
          ) : null}
          <div className="h-5 w-[1px] bg-greyscale4/50" />
          <div className="flex items-center gap-2">
            <Image
              src={getCurrencyIcon(game.token)}
              width={16}
              height={16}
              alt="token icon"
            />
            <p className="text-lg">{game.token}</p>
          </div>
          {game.creator && <div className="h-5 w-[1px] bg-greyscale4/50" />}
          <Timer status={game.status} gameTime={game.endDate} />
        </div>
      </div>
    </Link>
  );
};

export default GameCard;
