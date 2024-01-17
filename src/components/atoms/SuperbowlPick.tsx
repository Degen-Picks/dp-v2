import { FC } from "react";
import { SuperbowlGameCard, SuperbowlOption } from "@/types/Superbowl";

interface Props {
  accessor: keyof SuperbowlGameCard;
  title: string;
  option1?: SuperbowlOption;
  option2?: SuperbowlOption;
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
  const handleSelect = (option: string) => {
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
              gameCard[accessor]["answer"] === option1._id
                ? "bg-greyscale1 text-greyscale5"
                : "bg-greyscale1/5 hover:bg-greyscale1/10 text-greyscale1"
            }`}
            onClick={() => handleSelect(option1._id)}
          >
            {option1.title}
          </button>
          <button
            className={`p-2.5 w-full h-full
            font-figtree-semi text-lg rounded-[10px] rounded-l-none ${
              gameCard[accessor]["answer"] === option2._id
                ? "bg-greyscale1 text-greyscale5"
                : "bg-greyscale1/5 hover:bg-greyscale1/10 text-greyscale1"
            }`}
            onClick={() => handleSelect(option2._id)}
          >
            {option2.title}
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