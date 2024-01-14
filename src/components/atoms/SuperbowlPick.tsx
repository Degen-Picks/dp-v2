import { FC, useState } from "react";
import { SuperbowlGameCard } from "../organisms/SuperbowlGame";

interface Props {
  title: string;
  option1: string;
  option2: string;
  setGameCard: (card: SuperbowlGameCard) => void;
}

const SuperbowlPick: FC<Props> = ({ title, option1, option2, setGameCard }) => {
  const [selected, setSelected] = useState<1 | 2 | null>(null);

  const handleSelect = (option: 1 | 2) => {
    if (selected === option) {
      setSelected(null);
    } else {
      setSelected(option);
    }
  };
  return (
    <div className="w-[460px] flex flex-col gap-2.5">
      <p className="text-greyscale1/50 font-figtree-semi">{title}</p>
      <div className="w-full flex gap-0.5">
        <button
          className={`p-2.5 w-full h-full
          font-figtree-semi text-lg rounded-[10px] rounded-r-none ${
            selected === 1
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
            selected === 2
              ? "bg-greyscale1 text-greyscale5"
              : "bg-greyscale1/5 hover:bg-greyscale1/10 text-greyscale1"
          }`}
          onClick={() => handleSelect(2)}
        >
          {option2}
        </button>
      </div>
    </div>
  );
};

export default SuperbowlPick;
