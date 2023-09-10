import { GameInfo } from "@/types";
import { pickFee } from "@/utils";
import { FC } from "react";
import { TwitterShare } from "@/components";

interface Props {
  gameData: GameInfo;
}

const ManageStats: FC<Props> = ({ gameData }) => {
  const handleCreatorFee = () => {
    let creatorFee: number;
    const totalVolume = gameData.team1.dustVol + gameData.team2.dustVol;
    if (gameData.gameInfo.creator?.roles?.includes("ADMIN")) {
      creatorFee = totalVolume * pickFee;
    } else {
      creatorFee = (totalVolume * pickFee) / 2;
    }

    return creatorFee.toFixed(2);
  };

  return (
    <div className="relative bg-greyscale1 w-full md:w-[620px] h-[121px] mx-auto flex items-center">
      <div className="absolute right-0 -top-12">
        <TwitterShare
          url={`https://app.degenpicks.xyz/${gameData.gameInfo.id}`}
        />
      </div>
      {/* manage stats */}
      <div className="w-full flex justify-between items-center py-3 mx-5 sm:mx-8 md:mx-[60px]">
        <div className="sm:h-[81px] py-5 sm:py-0 px-5 sm:px-10 flex flex-col items-center justify-center">
          <p className="leading-none text-lg">
            {gameData.team1.uniqueWallets + gameData.team2.uniqueWallets}
          </p>
          <p className="text-center text-base text-greyscale4">players</p>
        </div>
        <div className="sm:h-[81px] py-5 sm:py-0 px-5 sm:px-10 flex flex-col items-center justify-center">
          <p className="leading-none text-lg">
            {(gameData.team1.dustVol + gameData.team2.dustVol).toFixed(2)}
          </p>
          <p className="text-center text-base text-greyscale4">volume</p>
        </div>
        <div className="sm:h-[81px] py-5 sm:py-0 px-5 sm:px-10 bg-greyscale2 flex flex-col items-center justify-center">
          <p className="leading-none text-lg">{handleCreatorFee()}</p>
          <p className="text-center text-base text-greyscale4">you get</p>
        </div>
      </div>
    </div>
  );
};

export default ManageStats;
