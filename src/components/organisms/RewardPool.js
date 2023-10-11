import { useState, useEffect } from "react";
import { PoolDetailsModal, RewardCircle, TwitterShare } from "@/components";
import { getTimezoneStr } from "../../utils";

const RewardPool = ({ gameData }) => {
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const [betRatio, setBetRatio] = useState({
    team1: 0,
    team2: 0,
  });

  const [multiplier, setMultiplier] = useState({
    team1: "1.0x",
    team2: "1.0x",
  });

  useEffect(() => {
    var team1Ratio =
      Math.floor(
        (gameData.team1.dustVol /
          (gameData.team1.dustVol + gameData.team2.dustVol)) *
          10000
      ) / 100;

    var team2Ratio = 100 - team1Ratio;
    if (Number.isNaN(team1Ratio)) {
      team1Ratio = 0;
      team2Ratio = 0;
    }

    setBetRatio({
      team1: team1Ratio,
      team2: team2Ratio,
    });
  }, [gameData]);

  useEffect(() => {
    const team1Multiplier =
      Math.floor(
        ((gameData.team1.dustVol + gameData.team2.dustVol) /
          gameData.team1.dustVol) *
          100
      ) / 100;

    const team2Multiplier =
      Math.floor(
        ((gameData.team1.dustVol + gameData.team2.dustVol) /
          gameData.team2.dustVol) *
          100
      ) / 100;

    const team1MultiplierParsed =
      team1Multiplier === Infinity ? "-" : `${team1Multiplier}x`;
    const team2MultiplierParsed =
      team2Multiplier === Infinity ? "-" : `${team2Multiplier}x`;

    if (!Number.isNaN(team1Multiplier) && !Number.isNaN(team1Multiplier)) {
      setMultiplier({
        team1: team1MultiplierParsed,
        team2: team2MultiplierParsed,
      });
    }
  }, [gameData]);

  return (
    <>
      {/* reward pool outer container */}
      <div className="relative bg-greyscale1 w-full md:w-[620px] mx-auto mt-[20px] text-base">
        <div className="absolute right-0 -top-12">
          <TwitterShare
            url={`https://app.degenpicks.xyz/${gameData.gameInfo.id}`}
          />
        </div>
        <div className="absolute left-0 -top-12">
          <button
            className="text-lg text-purple1"
            onClick={() => {
              setDetailsModalOpen(true);
            }}
          >
            Pool details
          </button>
        </div>
        <>
          <div className="flex flex-row justify-evenly items-center pb-5 pt-8">
            {/* team 1 spread */}
            <div className="hidden md:block w-[150px]">
              <RewardCircle
                value={betRatio.team1}
                team={gameData.team1.teamName}
              />
            </div>
            {/* reward data table */}
            <div className="flex flex-col justify-between w-[300px] h-fit text-lg font-base">
              {/* vol */}
              <div className="flex flex-row justify-between sm:pb-2">
                <div className="w-[80px] text-right pr-2">
                  {Math.floor(gameData.team1.dustVol * 100) / 100}
                </div>
                <div className="text-center">
                  <p className="px-3 text-greyscale4 text-base">volume</p>
                </div>
                <div className="w-[80px] text-left pl-2">
                  {Math.floor(gameData.team2.dustVol * 100) / 100}
                </div>
              </div>
              {/* unique wallets */}
              <div className="flex flex-row justify-between sm:pb-2">
                <div className="w-[80px] text-right pr-2">
                  {gameData.team1.uniqueWallets}
                </div>
                <div className="text-center">
                  <p className="px-3 text-greyscale4 text-base">players</p>
                </div>
                <div className="w-[80px] text-left pl-2">
                  {gameData.team2.uniqueWallets}
                </div>
              </div>
              {/* reward multiplier */}
              <div className="flex flex-row justify-between sm:pb-2">
                <div className="w-[80px] text-right pr-2">
                  {multiplier.team1}
                </div>
                <div className="relative z-50 text-center">
                  <p className="px-3 text-greyscale4 text-base">payout</p>
                </div>
                <div className="w-[80px] text-left pl-2">
                  {multiplier.team2}
                </div>
              </div>
            </div>
            {/* team 2 spread */}
            <div className="hidden md:block w-[150px]">
              <RewardCircle
                value={betRatio.team2}
                team={gameData.team2.teamName}
              />
            </div>
          </div>
          <div
            className="md:hidden h-fit flex flex-row justify-between 
              sm:justify-evenly mx-10 py-10 border-t border-black/20"
          >
            {/* team 1 spread */}
            <div className="w-[100px]">
              <RewardCircle
                value={betRatio.team1}
                team={gameData.team1.teamName}
              />
            </div>
            {/* team 2 spread */}
            <div className="w-[100px]">
              <RewardCircle
                value={betRatio.team2}
                team={gameData.team2.teamName}
              />
            </div>
          </div>
        </>
      </div>
      <PoolDetailsModal
        showModal={detailsModalOpen}
        setShowModal={setDetailsModalOpen}
      >
        <div className="w-full flex flex-col gap-2.5 items-center justify-center">
          <p className="text-2xl font-base-b text-center">Pool Details</p>
          <p className="text-xl text-center">
            {gameData.gameInfo.info !== "" ? gameData.gameInfo.info : "--"}
          </p>
          <div className="w-full h-[1px] bg-greyscale4/50 my-2.5" />
          <p className="text-xl text-center">
            {`Pool close:`}
            <br />
            {gameData.gameInfo.dateStr}
            {" @ "}
            {gameData.gameInfo.timeStr}
          </p>
          <div className="w-full flex items-center justify-end">
            <button
              className="text-lg text-purple1"
              onClick={() => {
                setDetailsModalOpen(false);
              }}
            >
              Close
            </button>
          </div>
        </div>
      </PoolDetailsModal>
    </>
  );
};

export default RewardPool;
