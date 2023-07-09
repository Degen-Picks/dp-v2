import { useState, useEffect } from "react";
import { RewardCircle, QuestionIcon } from "@/components";

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

const RewardPool = ({ gameData, picksOpened, gameType }) => {
  const [betRatio, setBetRatio] = useState({
    team1: 0,
    team2: 0,
  });

  const [multiplier, setMultiplier] = useState({
    team1: "1.0x",
    team2: "1.0x",
  });

  const fireHandler = (ratio) => {
    if (ratio <= 33.3 && ratio > 0) {
      return "🔥🔥🔥";
    } else if (ratio > 33.3 && ratio <= 66.6) {
      return "🔥🔥";
    } else if (ratio > 66.6) {
      return "🔥";
    } else {
      return "-";
    }
  };

  useEffect(() => {
    if (gameType === "degen") {
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
    }
  }, [gameData]);

  useEffect(() => {
    if (gameType === "degen") {
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
    }
  }, [gameData]);

  return (
    <div>
      {/* reward pool outer container */}
      <div className="bg-white w-5/6 md:w-[620px] mx-auto mt-10">
        {/* title on top */}
        <div className="relative h-[50px] flex items-center justify-center text-center text-containerHead bg-container">
          <p className="font-base-b text-sm sm:text-base">
            {`${gameData?.gameInfo?.dateStr} @ ${gameData?.gameInfo?.timeStr}` ??
              "Reward Pool"}
          </p>
          {picksOpened ? (
            <div className="hidden absolute right-3 sm:flex flex-row items-center px-3 rounded-md bg-white text-red-500 text-sm">
              <div className="blob"></div> Live
            </div>
          ) : (
            <div className="hidden absolute right-3 sm:flex flex-row items-center px-3 rounded-md bg-white text-slate-600 text-sm">
              Final
            </div>
          )}
        </div>
        {gameType === "degen" ? (
          <>
            <div className="flex flex-row justify-evenly items-center py-10">
              {/* team 1 spread */}
              <div className="hidden md:block w-[150px]">
                <RewardCircle
                  value={betRatio.team1}
                  team={gameData.team1.teamName}
                />
              </div>
              {/* reward data table */}
              <div className="flex flex-col justify-between w-[340px] h-fit text-sm sm:text-body-md">
                {/* vol */}
                <div className="flex flex-row justify-between pb-3">
                  <div className="w-[80px] text-right pr-2 font-base-b">
                    {Math.floor(gameData.team1.dustVol * 100) / 100}
                  </div>
                  <div className="text-center text-secondary">
                    <p className="px-3">volume</p>
                  </div>
                  <div className="w-[80px] text-left pl-2 font-base-b">
                    {Math.floor(gameData.team2.dustVol * 100) / 100}
                  </div>
                </div>
                {/* unique wallets */}
                <div className="flex flex-row justify-between pb-3">
                  <div className="w-[80px] text-right pr-2 font-base-b">
                    {gameData.team1.uniqueWallets}
                  </div>
                  <div className="text-center text-secondary">
                    <p className="px-3">players</p>
                  </div>
                  <div className="w-[80px] text-left pl-2 font-base-b">
                    {gameData.team2.uniqueWallets}
                  </div>
                </div>
                {/* reward level */}
                <div className="flex flex-row justify-between pb-3">
                  <div className="w-[80px] text-right pr-2">
                    {fireHandler(betRatio.team1)}
                  </div>
                  <div className="text-center text-secondary">
                    <p className="px-3">reward</p>
                  </div>
                  <div className="w-[80px] text-left pl-2">
                    {fireHandler(betRatio.team2)}
                  </div>
                </div>
                {/* reward multiplier */}
                <div className="flex flex-row justify-between sm:pb-3">
                  <div className="w-[80px] text-right pr-2 font-base-b">
                    {multiplier.team1}
                  </div>
                  <div className="relative z-50 text-center text-secondary">
                    <p className="px-3">payout</p>
                    <div className="group absolute -right-1 top-1/2 -translate-y-1/2">
                      <QuestionIcon fill="#651FFF" />
                      <div
                        className="z-50 absolute left-1/2 -translate-x-1/2 sm:bottom-1/2 sm:left-full sm:translate-x-0 ml-2 px-2 py-1 text-sm w-[200px] sm:w-[250px]
                        text-black bg-container rounded-lg opacity-0 group-hover:opacity-100 
                        transition-opacity duration-500 ease-in-out pointer-events-none group-hover:pointer-events-auto"
                      >
                        Your payout is determined by the multiplier. Multipliers
                        are highly volatile when the pool is live, and lock when
                        the pool closes.
                      </div>
                    </div>
                  </div>

                  <div className="w-[80px] text-left pl-2 font-base-b">
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
        ) : (
          <>
            <div
              className="flex flex-row justify-left 
              border-b border-border w-5/6 mx-auto pt-8 pb-4"
            >
              <div className="pr-2 sm:pr-6">
                <div className="text-sm sm:text-xl font-base-b">
                  {gameData.totalSpent.length > 4
                    ? `${gameData.totalSpent.toFixed(4)} DUST`
                    : `${gameData.totalSpent} DUST`}
                </div>
                <div className="text-[11px] sm:text-sm text-secondary">
                  total volume
                </div>
              </div>
              <div className="px-6 sm:px-16 w-fit mx-auto border-x border-border">
                <div className="text-sm sm:text-xl text-center font-base-b">
                  {gameData.totalUsers}
                </div>
                <div className="text-[11px] sm:text-sm text-secondary">
                  players
                </div>
              </div>
              <div className="pl-2 sm:pl-6 text-right">
                <div className="text-sm sm:text-xl font-base-b">
                  {gameData.entryFee} DUST
                </div>
                <div className="text-[11px] sm:text-sm text-secondary">
                  entry fee
                </div>
              </div>
            </div>
            <div className="w-5/6 mx-auto">
              <div className="pt-4 pb-2">Rewards</div>
              {/* <div className="pb-10">
                <PickemPlace place="first">
                  Winner takes all<br />
                  <span className="font-base-b">
                    {Math.floor(gameData.totalSpent*0.9*100)/100} DUST
                  </span>
                </PickemPlace>
              </div> */}
              <div className="w-full flex flex-row justify-between items-center pb-10">
                <PickemPlace place="first">
                  <span className="font-base-b">
                    {Math.floor(gameData.totalSpent * 0.65 * 0.9)} DUST
                  </span>
                </PickemPlace>
                <PickemPlace place="second">
                  <span className="font-base">
                    {Math.floor(gameData.totalSpent * 0.25 * 0.9)} DUST
                  </span>
                </PickemPlace>
                <PickemPlace place="third">
                  <span className="font-base">
                    {Math.floor(gameData.totalSpent * 0.1 * 0.9)} DUST
                  </span>
                </PickemPlace>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RewardPool;
