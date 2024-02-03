import { FC } from "react";
import BuyDustButton from "../atoms/BuyDustButton";
import SuperbowlButton from "../atoms/SuperbowlButton";

interface Props {
  numPicks: number;
  handlePayToken: () => void;
}

const SuperbowlFooter: FC<Props> = ({ numPicks, handlePayToken }) => {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 h-20 flex items-center px-2 md:px-0
      justify-between bg-greyscale6 text-greyscale1 border-t border-[#404040]"
    >
      <div className="md:px-[50px] flex items-center h-full">
        <BuyDustButton />
      </div>
      <div className="hidden md:flex w-full items-center justify-center h-full">
        <p className="text-[#404040]">Built by Degen Picks</p>
      </div>
      <div className="md:px-[50px] flex items-center h-full">
        <SuperbowlButton
          status=""
          numPicks={numPicks}
          handlePayToken={handlePayToken}
        />
      </div>
    </div>
  );
};

export default SuperbowlFooter;
