import { GameInfo } from "@/types";
import { pickFee } from "@/utils";
import { Dispatch, FC, SetStateAction } from "react";
import { InfoIcon, InfoModal, TwitterShare } from "@/components";

interface Props {
  gameData: GameInfo;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

const ManageStats: FC<Props> = ({ gameData, showModal, setShowModal }) => {
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
    <>
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
            <div className="relative w-fit">
              <p className="text-center text-base text-greyscale4">you get</p>
              <InfoIcon
                className="absolute -right-4 top-1/2 -translate-y-1/2 w-[14px] h-[14px] fill-purple1 cursor-pointer"
                onClick={() => setShowModal(true)}
              />
            </div>
          </div>
        </div>
      </div>
      <InfoModal showModal={showModal} setShowModal={setShowModal}>
        <div
          className="w-full pt-4 text-center gap-5
          flex flex-col items-center justify-center"
        >
          <p className="text-xl sm:text-2xl font-base-b text-center">
            Your potential payout
          </p>
          <p className="max-w-[400px] mx-auto text-base sm:text-lg">
            Your payout is determined by the multiplier. Multipliers are highly
            volatile when the pool is live, and lock when the pool closes.
          </p>
          <button
            className="ml-auto text-purple1 hover:text-purple2 text-lg"
            onClick={() => setShowModal(false)}
          >
            Close
          </button>
        </div>
      </InfoModal>
    </>
  );
};

export default ManageStats;
