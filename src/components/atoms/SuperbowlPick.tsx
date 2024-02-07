import { FC } from "react";
import { SuperbowlGameCard, SuperbowlOption } from "@/types/Superbowl";

interface Props {
  accessor: keyof SuperbowlGameCard;
  title: string;
  options?: SuperbowlOption[];
  gameCard: SuperbowlGameCard;
  setGameCard: (card: SuperbowlGameCard) => void;
}

const SuperbowlPick: FC<Props> = ({
  accessor,
  title,
  options,
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

  if (accessor === "tiebreaker")
    return (
      <div className="w-full md:w-[620px] mx-auto flex flex-col gap-2.5 font-figtree">
        <p className="text-[#808080]">{title}</p>
        <input
          className="w-full h-[70px] p-2.5 bg-greyscale5 rounded-[20px] text-greyscale1 text-center"
          type="number"
          min={0}
          value={gameCard[accessor]["answer"] as string}
          placeholder="Type here..."
          onChange={(e) =>
            setGameCard({
              ...gameCard,
              [accessor]: { ...gameCard[accessor], answer: e.target.value },
            })
          }
        />
      </div>
    );

  return (
    <div className="w-full md:w-[620px] mx-auto flex flex-col gap-2.5 font-figtree">
      <p className="text-[#808080]">{title}</p>
      {!!options && options.length > 0 && (
        <>
          {options.length === 2 && (
            <div className="w-full flex gap-0.5 h-[70px] text-greyscale1">
              {options.map((o, index) => (
                <button
                  key={o._id}
                  className={`p-2.5 w-full h-full rounded-[20px] ${
                    index < 1 && "rounded-r-none"
                  } ${index > 0 && "rounded-l-none"} ${
                    gameCard[accessor]["answer"] === o._id
                      ? "bg-[#282622] border border-data"
                      : "bg-greyscale5 hover:bg-greyscale1/10"
                  }`}
                  onClick={() => handleSelect(o._id)}
                >
                  {o.title}
                </button>
              ))}
            </div>
          )}
          {options.length === 3 && (
            <div className="w-full flex gap-0.5 h-[70px] text-greyscale1">
              {options.map((o, index) => (
                <button
                  key={o._id}
                  className={`p-2.5 w-full h-full rounded-[20px] ${
                    index === 1 && "rounded-none"
                  } ${index === 0 && "rounded-r-none"} ${
                    index === 2 && "rounded-l-none"
                  } ${
                    gameCard[accessor]["answer"] === o._id
                      ? "bg-[#282622] border border-data"
                      : "bg-greyscale5 hover:bg-greyscale1/10"
                  }`}
                  onClick={() => handleSelect(o._id)}
                >
                  {o.title}
                </button>
              ))}
            </div>
          )}
          {options.length >= 4 && (
            <div className="grid grid-cols-2 gap-0.5 h-[140px] text-greyscale1">
              {options.map((o, index) => (
                <button
                  key={o._id}
                  // assumes even number of options (4, 6, 8)
                  className={`p-2.5 w-full h-full ${
                    index === 0 && "rounded-tl-[20px]"
                  } ${index === 1 && "rounded-tr-[20px]"} ${
                    index === options.length - 1 && "rounded-br-[20px]"
                  } ${index === options.length - 2 && "rounded-bl-[20px]"} ${
                    gameCard[accessor]["answer"] === o._id
                      ? "bg-[#282622] border border-data"
                      : "bg-greyscale5 hover:bg-greyscale1/10"
                  }`}
                  onClick={() => handleSelect(o._id)}
                >
                  {o.title}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SuperbowlPick;
