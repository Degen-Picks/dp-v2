import { FC } from "react";
import Image from "next/image";
import { Timer } from "@/components";
import { Wager } from "@/types";

interface Props {
  game: Wager;
  isSelected: boolean;
  onSelect: () => void;
}

const GameCard: FC<Props> = ({ game, isSelected, onSelect }) => {
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
        return game.selections[index].winner ? "bg-correct" : "bg-transparent";
      case "cancelled":
        return "bg-transparent";
      default:
        return "bg-data";
    }
  };

  if (!game) return null;

  return (
    <div
      className={`relative h-auto md:h-[180px] w-full md:w-[610px] flex flex-col gap-[15px] justify-center
        px-[30px] py-[25px] mx-auto cursor-pointer border rounded-[10px] text-white
        ${isSelected ? "border-data" : "border-border"}`}
      onClick={onSelect}
    >
      <p className="text-[22px] leading-[21px] font-base-b">{game.title}</p>
      <div className="flex flex-col gap-2.5">
        {game.selections.map((selection, index) => (
          <div key={index} className="flex items-center gap-2.5">
            <div className="overflow-hidden relative !w-[200px] sm:w-[240px] h-[6px]">
              <div
                className={`absolute w-full h-full rounded-[10px] transition-transform duration-500 ${getColor(
                  game.status,
                  index
                )}`}
                style={{
                  width: `${index === 0 ? winningPercent() : 100 - winningPercent()}%`,
                }}
              />
              <div
                className={`absolute w-full h-full rounded-[10px] 
                  ${selection.winner ? "bg-[#5CB85C59]" : "bg-white/10"}`}
              />
            </div>
            <p className="w-[70px] sm:w-full text-base text-left truncate">
              {selection.title}
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-[30px]">
        <div className="flex items-center gap-[5px]">
          <Image
            src="/images/icons/new/money.png"
            width={14}
            height={14}
            alt="money icon"
          />
          <p className="text-sm">{`${game.token?.toUpperCase()}`}</p>
        </div>
        <div className="flex items-center gap-[5px]">
          <Image
            src="/images/icons/new/time.png"
            width={14}
            height={14}
            alt="time icon"
          />
          <Timer status={game.status} gameTime={game.endDate} />
        </div>
      </div>
    </div>
  );
};

export default GameCard;