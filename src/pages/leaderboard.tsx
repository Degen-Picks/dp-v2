import { FC, useEffect, useState } from "react";
import {
  LeaderboardCardPool,
  LeaderboardCardUser,
  LeaderboardTable,
  Navbar,
} from "@/components";
import { getLeaderboard } from "@/utils";
import { BarLoader } from "react-spinners";
import { LeaderboardData } from "@/types/LeaderboardData";

const Leaderboard: FC = () => {
  const [loading, setLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] =
    useState<LeaderboardData | null>(null);

  useEffect(() => {
    setLoading(true);

    getLeaderboard().then((data) => {
      setLeaderboardData(data);
      setLoading(false);
      console.log("leaderboard data", data);
    });
  }, []);

  return (
    <div className="relative bg-greyscale3 w-full overflow-hidden min-h-screen pb-20 md:pb-0">
      <Navbar landing={false} />
      <div className="w-full max-w-[620px] mx-auto mt-[60px]">
        <div className="w-full flex flex-col items-center justify-center gap-1">
          <div className="font-base-b text-center text-[32px] leading-[33px] text-black">
            Leaderboard
          </div>
          <div className="font-base text-center text-lg">
            Where legends are born.
          </div>
        </div>
      </div>
      {loading && (
        <div className="w-fit mx-auto flex flex-col items-center mt-56">
          <BarLoader color="black" />
        </div>
      )}
      <div className="w-full max-w-[940px] mx-auto mt-10 flex flex-col gap-5 sm:gap-10">
        {leaderboardData && (
          <>
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 px-5 sm:px-0">
              <LeaderboardCardUser
                user={leaderboardData.mostWins}
                title="Most wins"
                dataTitle="wins"
                dataValue={leaderboardData.mostWins.stats.totalWins}
              />
              <LeaderboardCardUser
                user={leaderboardData.mostGamesPlayed}
                title="Participation award"
                dataTitle="games"
                dataValue={leaderboardData.mostWins.stats.totalGamesPlayed}
              />
              <LeaderboardCardUser
                user={leaderboardData.highestWinStreak}
                title="Win streak"
                dataTitle="wins"
                dataValue={leaderboardData.mostWins.stats.winStreak}
              />
              <LeaderboardCardUser
                user={leaderboardData.mostCreations}
                title="Top creator"
                dataTitle="pools"
                dataValue={leaderboardData.mostWins.stats.totalGamesCreated}
              />
              {/* <LeaderboardCardPool
              gameData={leaderboardData.hottestPool}
              title="Hottest pool"
              dataTitle="players"
            />
            <LeaderboardCardPool gameData={} title="Craziest upset" /> */}
              <LeaderboardCardUser
                user={leaderboardData.hottestPool}
                title="Hottest pool"
                dataTitle="players"
                dataValue={leaderboardData.hottestPool.stats.hottestPool}
              />
              <LeaderboardCardUser
                user={leaderboardData.craziestUpset}
                title="Craziest upset"
                dataTitle=""
                dataValue={
                  leaderboardData.craziestUpset.stats.craziestUpset.toFixed(2) +
                  "x"
                }
              />
            </div>
            <LeaderboardTable users={leaderboardData.users} />
          </>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
