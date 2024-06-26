import { FC } from "react";
import Image from "next/image";
import { FallbackImage, Timer } from "@/components";
import { Wager } from "@/types";
import { getCurrencyIcon } from "@/utils";
import { DrawerState } from "@/pages/classic";

interface Props {
  game: Wager;
  drawerOpen: boolean;
  setDrawerOpen: (value: boolean) => void;
  activeCard: Wager | null;
  setActiveCard: (value: Wager | null) => void;
  setDrawerState: (value: DrawerState) => void;
}

const GameCard: FC<Props> = ({
  game,
  drawerOpen,
  setDrawerOpen,
  activeCard,
  setActiveCard,
  setDrawerState,
}) => {
  const winningPercent = () => {
    const total = game.selections[0].totalSpent + game.selections[1].totalSpent;
    if (total === 0) return 0;
    const percent = Math.ceil((game.selections[0].totalSpent * 100) / total);
    return percent;
  };

  const getColor = (status: string, index: number) => {
    switch (status) {
      case "closed":
        return "bg-data";
      case "completed":
        if (!game.selections[index].winner) return "bg-transparent";
        else return "bg-correct";
      case "cancelled":
        return "bg-transparent";
      default:
        return "bg-data";
    }
  };

  if (!game) return null;

  return (
    // <Link className="w-full" passHref href={`/${encodeURI(game._id)}`}>
    <div
      className={`relative h-auto md:h-[180px] w-full md:w-[610px] flex flex-col gap-[15px] justify-center
        px-[30px] py-[25px] mx-auto cursor-pointer border rounded-[10px] text-white
        ${activeCard?._id === game._id ? "border-data" : "border-border"}`}
      onClick={() => {
        if (activeCard?._id === game._id && drawerOpen) {
          setDrawerOpen(false);
          setDrawerState(DrawerState.None);
          setActiveCard(null);
        } else {
          setDrawerOpen(true);
          setDrawerState(DrawerState.SelectedGame);
          setActiveCard(game);
        }
      }}
    >
      <p className="text-[22px] leading-[21px] font-base-b">{game.title}</p>
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="overflow-hidden relative !w-[200px] sm:w-[240px] h-[6px]">
            <div
              className={`absolute w-full h-full rounded-[10px] transition-transform duration-500 ${getColor(
                game.status,
                0
              )}`}
              style={{
                width: `${winningPercent()}%`,
              }}
            />
            <div
              className={`absolute w-full h-full bg-white/10 rounded-[10px] 
                ${
                  game.selections[0].winner ? "bg-[#5CB85C59]" : "bg-white/10"
                }`}
            />
          </div>
          <p className="w-[70px] sm:w-full text-base text-left truncate">
            {game.selections[0].title}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="overflow-hidden relative !w-[200px] sm:w-[240px] h-[6px]">
            <div
              className={`absolute w-full h-full rounded-[10px] transition-transform duration-500 ${getColor(
                game.status,
                1
              )}`}
              style={{
                width: `${100 - winningPercent()}%`,
              }}
            />
            <div
              className={`absolute w-full h-full rounded-[10px] bg-white/10
                ${
                  game.selections[1].winner ? "bg-[#5CB85C59]" : "bg-white/10"
                }`}
            />
          </div>
          <p className="w-[70px] sm:w-full text-base text-left truncate">
            {game.selections[1].title}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-[30px]">
        {/* {game.creator?.roles?.includes("ADMIN") ? (
          <div className="flex items-center gap-[5px]">
            <Image
              src="/images/team_icon.png"
              width={16}
              height={16}
              alt="dp team icon"
            />
            <p className="uppercase text-lg">team</p>
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
        ) : null} */}
        {/* <div className="h-5 w-[1px] bg-greyscale4/50" /> */}
        <div className="flex items-center gap-[5px]">
          <Image
            src="/images/icons/new/money.png"
            width={14}
            height={14}
            alt="money icon"
          />
          <p className="text-sm">{`TODO ${game.token?.toUpperCase()}`}</p>
        </div>
        <div className="flex items-center gap-[5px]">
          <Image
            src="/images/icons/new/time.png"
            width={14}
            height={14}
            alt="money icon"
          />
          <Timer status={game.status} gameTime={game.endDate} />
        </div>
      </div>
    </div>
    // </Link>
  );
};

export default GameCard;
