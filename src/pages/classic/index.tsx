import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { getStats, getWagers } from "@/utils";
import { GameFilter, GameCard } from "@/components";
import { Stats, Wager } from "@/types";
import { withRedirect } from "@/utils/withRedirect";
import { BarLoader } from "react-spinners";
import { AnimatePresence, motion } from "framer-motion";
import NewNavbar from "@/components/organisms/NewNavBar";
import io from "socket.io-client";
import { ActivityFeedItem } from "@/types/ActivityFeed";
import { generalConfig } from "@/configs";
import Drawer from "@/components/organisms/Drawer";
import DrawerButtons from "@/components/molecules/DrawerButtons";

export enum DrawerState {
  None = "None",
  SelectedGame = "SelectedGame",
  Activity = "Activity",
  PersonalStats = "Personal Stats",
  CreateGame = "Create Game",
}

const GameQueue = () => {
  const [games, setGames] = useState<Wager[]>([]);
  const [loading, setLoading] = useState(true);
  const [statData, setStatData] = useState<Stats | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeCard, setActiveCard] = useState<Wager | null>(null);
  const [drawerState, setDrawerState] = useState<DrawerState>(DrawerState.None);
  const [drawerContent, setDrawerContent] = useState<
    ActivityFeedItem[] | Stats | Wager | null
  >(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  // const [showStandingsModal, setShowStandingsModal] = useState(false);
  const [activityFeed, setActivityFeed] = useState<ActivityFeedItem[]>([]);
  const [activeFilter, setActiveFilter] = useState(true);

  const loadStatData = async () => {
    const statData: Stats | null = await getStats();
    if (statData === null) return;

    setStatData(statData);
  };

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

  const handleDrawerStateChange = useCallback(
    (state: DrawerState) => {
      switch (state) {
        case DrawerState.Activity:
          setActiveCard(null);
          setDrawerContent(activityFeed);
          break;
        case DrawerState.PersonalStats:
          setActiveCard(null);
          setDrawerContent(statData);
          break;
        case DrawerState.SelectedGame:
          setDrawerContent(
            games.find((game) => game._id === activeCard?._id) ?? null
          );
          break;
        case DrawerState.CreateGame:
          setActiveCard(null);
          setDrawerContent(statData); // temp
          break;
        default:
          setActiveCard(null);
          setDrawerContent(statData); // temp
          break;
      }
    },
    [activityFeed, statData, games, activeCard]
  );

  const activeLiveGames = games
    ?.filter((game: Wager) => activeFilter === true && game.status === "live")
    .sort((a: Wager, b: Wager) => a.endDate - b.endDate)
    .map((game, index) => {
      return (
        <GameCard
          key={index}
          game={game}
          drawerOpen={drawerOpen}
          setDrawerOpen={setDrawerOpen}
          activeCard={activeCard}
          setActiveCard={setActiveCard}
          setDrawerState={setDrawerState}
        />
      );
    });

  const activeClosedGames = games
    ?.filter((game) => activeFilter === true && game.status === "closed")
    .sort((a: Wager, b: Wager) => b.endDate - a.endDate)
    .map((game, index) => {
      return (
        <GameCard
          key={index}
          game={game}
          drawerOpen={drawerOpen}
          setDrawerOpen={setDrawerOpen}
          activeCard={activeCard}
          setActiveCard={setActiveCard}
          setDrawerState={setDrawerState}
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
          drawerOpen={drawerOpen}
          setDrawerOpen={setDrawerOpen}
          activeCard={activeCard}
          setActiveCard={setActiveCard}
          setDrawerState={setDrawerState}
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
          drawerOpen={drawerOpen}
          setDrawerOpen={setDrawerOpen}
          activeCard={activeCard}
          setActiveCard={setActiveCard}
          setDrawerState={setDrawerState}
        />
      );
    });

  useEffect(() => {
    loadGameData();
  }, []);

  useEffect(() => {
    async function loadStats() {
      await loadStatData();
    }

    loadStats();
  }, []);

  useEffect(() => {
    const socket = io(generalConfig.wsUrl);

    socket.on("activityFeed", (activity: ActivityFeedItem) => {
      setActivityFeed((prevFeed) => [activity, ...prevFeed]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    handleDrawerStateChange(drawerState);
  }, [drawerState, handleDrawerStateChange]);

  useEffect(() => {
    console.log("active game", activeCard);
    console.log("drawer state", drawerState);
    console.log("drawer content", drawerContent);
  }, [activeCard, drawerState, drawerContent]);

  return (
    <div className="relative flex flex-col bg-greyscale5 w-full h-screen pb-20 md:pb-0">
      <NewNavbar
        open={mobileMenuOpen}
        setOpen={setMobileMenuOpen}
        showInfoModal={showInfoModal}
        setShowInfoModal={setShowInfoModal}
      />

      {loading ? (
        <div className="w-fit mx-auto flex flex-col items-center mt-56">
          <BarLoader color="white" />
        </div>
      ) : (
        <div className="relative w-full flex items-start justify-between mt-20">
          <div className="flex flex-col gap-[30px] mt-12 mb-40 z-20 px-[100px] overflow-y-auto">
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
              <div className="w-full md:w-[620px] flex flex-col pt-10">
                <p className="text-center text-lg pt-5">
                  No live games right now.
                </p>
              </div>
            )}
            {/* Render games based on filter status */}
            {activeFilter ? (
              <div className="flex flex-col gap-4">
                {activeLiveGames}
                {activeUpcomingGames}
                {activeClosedGames}
              </div>
            ) : (
              <div className="flex flex-col gap-4">{pastGames}</div>
            )}
          </div>
          <AnimatePresence>
            <motion.div
              initial={{ x: drawerOpen ? "100%" : "calc(100% - 64px)" }}
              animate={{ x: drawerOpen ? 0 : "calc(100% - 64px)" }}
              exit={{ x: drawerOpen ? "100%" : "calc(100% - 64px)" }}
              transition={{ duration: 0.5 }}
              className="fixed right-0 top-20 flex gap-4"
            >
              <DrawerButtons
                drawerOpen={drawerOpen}
                setDrawerOpen={setDrawerOpen}
                drawerState={drawerState}
                setDrawerState={setDrawerState}
              />
              <Drawer
                setDrawerOpen={setDrawerOpen}
                data={drawerContent}
                drawerState={drawerState}
                setDrawerState={setDrawerState}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export const getServerSideProps = withRedirect();
export default GameQueue;
