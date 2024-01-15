import { FC } from "react";
import { SuperbowlGameCard } from "@/types/Superbowl";

interface Props {
  accessor: keyof SuperbowlGameCard;
  title: string;
  option1?: string;
  option2?: string;
  gameCard: SuperbowlGameCard;
  setGameCard: (card: SuperbowlGameCard) => void;
}

const SuperbowlPick: FC<Props> = ({
  accessor,
  title,
  option1,
  option2,
  gameCard,
  setGameCard,
}) => {
  const handleSelect = (option: 1 | 2) => {
    if (gameCard[accessor]["answer"] === option) {
      setGameCard({
        ...gameCard,
        [accessor]: { ...gameCard[accessor], answer: null },
      });
    } else {
      setGameCard({
        ...gameCard,
        [accessor]: { ...gameCard[accessor], answer: option },
      });
    }
  };
  return (
    <div className="w-[460px] flex flex-col gap-2.5">
      <p className="text-greyscale1/50 font-figtree-semi">{title}</p>
      {!!option1 && !!option2 ? (
        <div className="w-full flex gap-0.5">
          <button
            className={`p-2.5 w-full h-full
            font-figtree-semi text-lg rounded-[10px] rounded-r-none ${
              gameCard[accessor]["answer"] === 1
                ? "bg-greyscale1 text-greyscale5"
                : "bg-greyscale1/5 hover:bg-greyscale1/10 text-greyscale1"
            }`}
            onClick={() => handleSelect(1)}
          >
            {option1}
          </button>
          <button
            className={`p-2.5 w-full h-full
            font-figtree-semi text-lg rounded-[10px] rounded-l-none ${
              gameCard[accessor]["answer"] === 2
                ? "bg-greyscale1 text-greyscale5"
                : "bg-greyscale1/5 hover:bg-greyscale1/10 text-greyscale1"
            }`}
            onClick={() => handleSelect(2)}
          >
            {option2}
          </button>
        </div>
      ) : (
        <input
          className="w-full h-[45px] p-2.5 bg-greyscale1/5 rounded-[10px] font-figtree-semi text-lg text-greyscale1 text-center"
          type="number"
          value={gameCard[accessor]["answer"] as string}
          onChange={(e) =>
            setGameCard({
              ...gameCard,
              [accessor]: { ...gameCard[accessor], answer: e.target.value },
            })
          }
        />
      )}
    </div>
  );
};

export default SuperbowlPick;
