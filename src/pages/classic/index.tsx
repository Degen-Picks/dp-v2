import { useEffect, useState, FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { getCurrencyIcon, getStats, getWagers } from "@/utils";
import {
  Navbar,
  GameFilter,
  Timer,
  AlertBanner,
  FallbackImage,
  DataBar,
  DataBarMobile,
  GameCard,
} from "@/components";
import { Stats, Wager, WagerUser } from "@/types";
import { withRedirect } from "@/utils/withRedirect";
import { useWallet } from "@solana/wallet-adapter-react";
import { BarLoader } from "react-spinners";
import { useWindowSize } from "@/hooks/useWindowSize";

const GameQueue = () => {
  const [games, setGames] = useState<Wager[]>([]);
  const [activeFilter, setActiveFilter] = useState(true);
  const [loading, setLoading] = useState(true);
  const [statData, setStatData] = useState<Stats | null>(null);

  const { publicKey } = useWallet();

  const [width] = useWindowSize();
  const isMobile = width < 1024;

  const loadStatData = async () => {
    const statData: Stats | null = await getStats();
    if (statData === null) return;

    setStatData(statData);
  };

  useEffect(() => {
    async function loadStats() {
      await loadStatData();
    }

    loadStats();
  }, []);

  // this function fetches the status for each game
  const loadGameData = async () => {
    setLoading(true);
    let gameData: Wager[] | null = await getWagers();

    if (gameData === null) {
      setGames([]);
      return;
    }

    setGames(gameData ?? []);
    setLoading(false);
  };

  const activeLiveGames = games
    ?.filter((game: Wager) => activeFilter === true && game.status === "live")
    .sort((a: Wager, b: Wager) => a.endDate - b.endDate)
    .map(
      (game, index) => {
        return <GameCard key={index} game={game} />;
      }
      // now, sort upcoming games by date
    );

  const activeClosedGames = games
    ?.filter((game) => activeFilter === true && game.status === "closed")
    .sort((a: Wager, b: Wager) => b.endDate - a.endDate)
    .map((game, index) => {
      return <GameCard key={index} game={game} />;
    });

  const activeUpcomingGames = games
    ?.filter((game) => activeFilter === true && game.status === "upcoming")
    .sort((a: Wager, b: Wager) => b.endDate - a.endDate)
    .map((game, index) => {
      return <GameCard key={index} game={game} />;
    });

  const pastGames = games
    ?.filter(
      (game) =>
        activeFilter === false &&
        (game.status === "completed" || game.status === "cancelled")
    )
    .reverse()
    .map((game, index) => {
      return <GameCard key={index} game={game} />;
    });

  useEffect(() => {
    loadGameData();
  }, []);

  return (
    <div className="relative bg-greyscale3 w-full overflow-hidden min-h-screen pb-20 md:pb-0">
      {!loading && (
        <>
          <AlertBanner
            text={
              "Now you can run your own Degen Picks™ pool, and get 50% of the fees."
            }
            ctaText={"Learn More"}
            ctaLink={"https://degenpicks.xyz"}
          />
          {/* <Navbar /> */}
        </>
      )}

      {loading ? (
        <div className="w-fit mx-auto flex flex-col items-center mt-56">
          <BarLoader color="black" />
        </div>
      ) : (
        <div
          className="flex flex-col gap-5 items-center w-[90%] 
          md:w-fit mx-auto justify-center mb-40 z-20"
        >
          <div
            className={`hidden md:block absolute ${
              publicKey ? "top-[92px]" : "top-7"
            }  left-1/2 -translate-x-1/2`}
          >
            <GameFilter
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
            />
          </div>
          <div className="md:hidden mt-6">
            <GameFilter
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
            />
          </div>
          {games?.filter(
            (game) =>
              (activeFilter === true &&
                (game.status === "live" ||
                  game.status === "closed" ||
                  game.status === "upcoming")) ||
              (activeFilter === false &&
                (game.status === "completed" || game.status === "cancelled"))
          ).length === 0 && (
            <div className="w-full md:w-[620px] flex flex-col items-center justify-center pt-10">
              <p className="text-center text-lg pt-5">
                No live games right now.
              </p>
            </div>
          )}
          {/* live games always go first, sorted by date */}
          {activeFilter === true ? (
            <div className={`w-full grid grid-cols-1 gap-1 mt-10`}>
              {activeLiveGames}
              {activeUpcomingGames}
              {activeClosedGames}
            </div>
          ) : (
            <div className="w-full grid grid-cols-1 gap-1 mt-10">
              {pastGames}
            </div>
          )}
        </div>
      )}
      {/* {statData &&
        (isMobile ? (
          <DataBarMobile stats={statData} />
        ) : (
          <DataBar stats={statData} />
        ))} */}
    </div>
  );
};

export const getServerSideProps = withRedirect();
export default GameQueue;
