import { FC } from "react";
import BuyDustButton from "../atoms/BuyDustButton";
import SuperbowlButton from "../atoms/SuperbowlButton";

interface Props {
  numPicks: number;
}

const SuperbowlFooter: FC<Props> = ({ numPicks }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 flex items-center justify-between bg-greyscale6 text-greyscale1 border-t border-[#404040]">
      <div className="px-[50px] flex items-center h-full border-r border-[#404040]">
        <BuyDustButton />
      </div>
      <div className="w-full flex items-center justify-center h-full">
        <p className="text-[#404040]">Built by Degen Picks</p>
      </div>
      <div className="px-[50px] flex items-center h-full border-l border-[#404040]">
        <SuperbowlButton status="" numPicks={numPicks} />
      </div>
    </div>
  );
};

export default SuperbowlFooter;
