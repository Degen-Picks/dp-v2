import { useEffect, useState, FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { getCurrencyIcon, getStats, getWagers } from "@/utils";
import {
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
import { BarLoader } from "react-spinners";
import { AnimatePresence, motion } from "framer-motion";
import NewNavbar from "@/components/organisms/NewNavBar";

const GameQueue = () => {
  const [games, setGames] = useState<Wager[]>([]);
  const [activeFilter, setActiveFilter] = useState(true);
  const [loading, setLoading] = useState(true);
  const [statData, setStatData] = useState<Stats | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [activeCard, setActiveCard] = useState<Wager | null>(null);
  // const [firstItemWidth, setFirstItemWidth] = useState("90%");

  // modal logic
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showStandingsModal, setShowStandingsModal] = useState(false);


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
        return (
          <GameCard
            key={index}
            game={game}
            setDrawerOpen={setDrawerOpen}
            activeCard={activeCard}
            setActiveCard={setActiveCard}
          />
        );
      }
      // now, sort upcoming games by date
    );

  const activeClosedGames = games
    ?.filter((game) => activeFilter === true && game.status === "closed")
    .sort((a: Wager, b: Wager) => b.endDate - a.endDate)
    .map((game, index) => {
      return (
        <GameCard
          key={index}
          game={game}
          setDrawerOpen={setDrawerOpen}
          activeCard={activeCard}
          setActiveCard={setActiveCard}
        />
      );
    });

  const activeUpcomingGames = games
    ?.filter((game) => activeFilter === true && game.status === "upcoming")
    .sort((a: Wager, b: Wager) => b.endDate - a.endDate)
    .map((game, index) => {
      return (
        <GameCard
          key={index}
          game={game}
          setDrawerOpen={setDrawerOpen}
          activeCard={activeCard}
          setActiveCard={setActiveCard}
        />
      );
    });

  const pastGames = games
    ?.filter(
      (game) =>
        activeFilter === false &&
        (game.status === "completed" || game.status === "cancelled")
    )
    .reverse()
    .map((game, index) => {
      return (
        <GameCard
          key={index}
          game={game}
          setDrawerOpen={setDrawerOpen}
          activeCard={activeCard}
          setActiveCard={setActiveCard}
        />
      );
    });

  // useEffect(() => {
  //   setFirstItemWidth(drawerOpen ? "calc(100% - 600px)" : "90%");
  // }, [drawerOpen]);

  useEffect(() => {
    loadGameData();
  }, []);

  return (
    <div className="relative bg-greyscale5 w-full overflow-hidden min-h-screen pb-20 md:pb-0">
      {!loading && (
        <>
          <NewNavbar
            open={mobileMenuOpen}
            setOpen={setMobileMenuOpen}
            showInfoModal={showInfoModal}
            setShowInfoModal={setShowInfoModal}
          />
        </>
      )}

      {loading ? (
        <div className="w-fit mx-auto flex flex-col items-center mt-56">
          <BarLoader color="black" />
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <div className="w-full flex items-start justify-between">
            <motion.div className="flex flex-col gap-5 items-center mx-auto justify-center mt-12 mb-40 z-20">
              <GameFilter
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
              />
              {/* Conditional rendering based on filters and game status */}
              {games?.filter((game) =>
                activeFilter
                  ? ["live", "closed", "upcoming"].includes(game.status)
                  : ["completed", "cancelled"].includes(game.status)
              ).length === 0 && (
                <div className="w-full md:w-[620px] flex flex-col items-center justify-center pt-10">
                  <p className="text-center text-lg pt-5">
                    No live games right now.
                  </p>
                </div>
              )}
              {/* Render games based on filter status */}
              {activeFilter ? (
                <div className="w-full grid grid-cols-1 gap-2">
                  {activeLiveGames}
                  {activeUpcomingGames}
                  {activeClosedGames}
                </div>
              ) : (
                <div className="w-full grid grid-cols-1 gap-2">{pastGames}</div>
              )}
            </motion.div>
            {drawerOpen && (
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.5 }}
                className="w-[600px] min-h-screen h-full border-l border-border z-40"
              >
                Some content
              </motion.div>
            )}
          </div>
        </AnimatePresence>
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
