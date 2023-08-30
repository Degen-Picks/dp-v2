import { useState, useEffect } from "react";
import {
  Footer,
  GameOptions,
  Roadmap,
  Friends,
  Navbar,
  DataPoint,
  ClassicView,
} from "@/components";
import { getWagers, getPickems, getStats } from "../utils/api/apiUtil";
import { Pickem, Stats, Wager } from "@/types";
import { GetServerSideProps, NextPage } from "next/types";
import GameQueue from "./classic";

const Landing = () => {
  const [statData, setStatData] = useState<Stats>();
  const [pickemLive, setPickemLive] = useState(false);
  const [classicLive, setClassicLive] = useState(false);

  // const router = useRouter();
  // const marchMadness = new Date("March 21, 2023").getTime();

  // this function fetches the status for each game
  const loadGameData = async () => {
    const wagerData = await getWagers();
    const pickemData = await getPickems();

    const classicLive = wagerData?.filter(
      (wager: Wager) => wager.status === "live"
    );
    const pickemLive = pickemData?.filter(
      (pickem: Pickem) => pickem.status === "live"
    );

    if (classicLive === undefined || classicLive.length === 0) {
      setClassicLive(false);
    } else {
      setClassicLive(true);
    }

    if (pickemLive === undefined || pickemLive.length === 0) {
      setPickemLive(false);
    } else {
      setPickemLive(true);
    }
  };

  const loadStatData = async () => {
    const statData: Stats | null = await getStats();
    if (statData === null) return;

    const { gamesHosted, uniquePlayers, totalVolume } = statData;

    setStatData({
      gamesHosted: gamesHosted,
      uniquePlayers: uniquePlayers,
      totalVolume: totalVolume,
    });
  };

  useEffect(() => {
    async function loadPick() {
      await loadGameData();
    }

    loadPick();
  }, []);

  useEffect(() => {
    async function loadStats() {
      await loadStatData();
    }

    loadStats();
  }, []);

  return (
    <div className="w-full relative overflow-hidden min-h-screen">
      {/* outer container */}
      <div className="bg-light pb-20">
        <Navbar />
        <div className="mx-4 sm:max-w-[1000px] sm:mx-auto mt-10">
          {/* logo section */}
          {/* <Header type={"hero"} wagerData={wagers} pickemData={picks} /> */}
          {/* targetUTC={marchMadness} */}
          {/* two game options */}
          <GameOptions classicLive={classicLive} pickemLive={pickemLive} />
        </div>
      </div>
      {/* first subsection */}
      <div className="bg-white">
        <div className="text-center sm:max-w-[1000px] sm:mx-auto">
          <div className="w-[90%] md:w-[3/4] mx-auto py-20 sm:pb-20 border-b border-border">
            <div className="w-fit mx-auto sm:my-12">
              <div className="font-base-b text-3xl text-black">
                Join your favorite internet anons
              </div>
              <div className="text-[18px] lg:text-xl px-8 mt-4 text-secondary max-w-[620px]">
                <p>
                  We&apos;re cultivating the most elite community of sports
                  enthusiasts and degenerates in web3.
                </p>
              </div>
            </div>
            <div className="mt-10 sm:mt-0 max-w-[820px] sm:h-[90px] flex flex-col sm:flex-row sm:justify-between items-center mx-auto">
              {statData !== null && (
                <>
                  <DataPoint
                    title="games hosted"
                    value={statData?.gamesHosted!}
                  />
                  <DataPoint
                    title="unique players"
                    value={statData?.uniquePlayers!}
                  />
                  <DataPoint
                    title="total DUST volume"
                    value={statData?.totalVolume!}
                  />
                </>
              )}
            </div>
          </div>
        </div>
        <Roadmap />
      </div>

      {/* team section */}
      <div className="bg-light px-4">
        <Friends />
      </div>

      <Footer />
    </div>
  );
};

interface HomePageProps {
  host: string | null;
  path: string | null;
}

const HomePage: NextPage<HomePageProps> = ({ host, path }) => {
  if (host === 'app.degenpicks.xyz' || host === 'app.staging.degenpicks.xyz') {
      return <GameQueue />;
  }
  
  return <Landing />;
};

export const getServerSideProps: GetServerSideProps<HomePageProps> = async (context) => {
  const host = context.req.headers.host || null;
  const path = context.req.url || null;
  return { props: { host, path } };
};

export default HomePage;
