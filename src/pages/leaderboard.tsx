import { FC, useContext, useEffect, useState } from "react";
import {
  LeaderboardCardPool,
  LeaderboardCardUser,
  LeaderboardTable,
  Navbar,
} from "@/components";
import {
  WagerUserContext,
  WagerUserContextType,
} from "@/components/stores/WagerUserStore";
import { Wager } from "@/types";
import { getWagers } from "@/utils";
import { BarLoader } from "react-spinners";

const Leaderboard: FC = () => {
  // stubbing currennt user context for now
  const { wagerUser } = useContext(WagerUserContext) as WagerUserContextType;

  // const [games, setGames] = useState<Wager[]>([]);
  const [loading, setLoading] = useState(true);

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
      {/* {loading && (
        <div className="w-fit mx-auto flex flex-col items-center mt-56">
          <BarLoader color="black" />
        </div>
      )} */}
      <div className="w-full max-w-[940px] mx-auto mt-10 flex flex-col gap-20">
        {wagerUser && (
          // {!loading && wagerUser && (
          <div className="w-full grid grid-cols-3 gap-5">
            <LeaderboardCardUser
              user={wagerUser}
              title="Most wins"
              dataTitle="wins"
            />
            <LeaderboardCardUser
              user={wagerUser}
              title="Participation award"
              dataTitle="games"
            />
            <LeaderboardCardUser
              user={wagerUser}
              title="Win streak"
              dataTitle="wins"
            />
            <LeaderboardCardUser
              user={wagerUser}
              title="Top creator"
              dataTitle="pools"
            />
            {/* <LeaderboardCardPool
            gameData={}
            title="Hottest pool"
            dataTitle="players"
          />
          <LeaderboardCardPool gameData={} title="Craziest upset" /> */}
          </div>
        )}
        <LeaderboardTable />
      </div>
    </div>
  );
};

export default Leaderboard;
