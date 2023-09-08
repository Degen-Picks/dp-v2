import { useState, useEffect } from "react";
import { RewardCircle, TwitterShare } from "@/components";

const renderPlace = (thisPlace) => {
  switch (thisPlace) {
    case "first":
      return "🏆";
    case "second":
      return "🥈";
    default:
      return "🥉";
  }
};

const PickemPlace = ({ place, children }) => {
  const emoji = renderPlace(place);
  return (
    <div className="w-[72px] sm:w-[100px] md:w-[130px] lg:w-[160px] h-[60px] sm:h-[77px] bg-[#F0EBE9]">
      <div className="h-full w-fit mx-auto text-center flex flex-col justify-center text-xs sm:text-sm lg:">
        <p>{emoji}</p>
        <p>{children}</p>
      </div>
    </div>
  );
};

const RewardPool = ({ gameData }) => {
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
    <div>
      {/* reward pool outer container */}
      <div className="relative bg-greyscale1 w-5/6 md:w-[620px] mx-auto mt-10 text-base">
        <div className="absolute right-0 -top-12">
          <TwitterShare
            url={`https://app.degenpicks.xyz/${gameData.gameInfo.id}`}
          />
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
            <div className="flex flex-col justify-between w-[340px] h-fit text-base sm:text-lg font-base">
              {/* vol */}
              <div className="flex flex-row justify-between pb-3">
                <div className="w-[80px] text-right pr-2">
                  {Math.floor(gameData.team1.dustVol * 100) / 100}
                </div>
                <div className="text-center">
                  <p className="px-3 text-greyscale4">volume</p>
                </div>
                <div className="w-[80px] text-left pl-2">
                  {Math.floor(gameData.team2.dustVol * 100) / 100}
                </div>
              </div>
              {/* unique wallets */}
              <div className="flex flex-row justify-between pb-3">
                <div className="w-[80px] text-right pr-2">
                  {gameData.team1.uniqueWallets}
                </div>
                <div className="text-center">
                  <p className="px-3 text-greyscale4">players</p>
                </div>
                <div className="w-[80px] text-left pl-2">
                  {gameData.team2.uniqueWallets}
                </div>
              </div>
              {/* reward multiplier */}
              <div className="flex flex-row justify-between sm:pb-3">
                <div className="w-[80px] text-right pr-2">
                  {multiplier.team1}
                </div>
                <div className="relative z-50 text-center">
                  <p className="px-3 text-greyscale4">reward</p>
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
    </div>
  );
};

export default RewardPool;
