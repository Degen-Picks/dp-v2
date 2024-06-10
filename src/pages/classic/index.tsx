import { useEffect, useState, FC } from "react";
import { getStats, getWagers } from "@/utils";
import { GameCard } from "@/components";
import { Stats, Wager, WagerUser } from "@/types";
import { withRedirect } from "@/utils/withRedirect";
import { BarLoader } from "react-spinners";
import { AnimatePresence, motion } from "framer-motion";
import NewNavbar from "@/components/organisms/NewNavBar";
import io from 'socket.io-client';
import { ActivityFeedItem } from "@/types/ActivityFeed";
import { generalConfig } from "@/configs";
import ActivityFeedList from "@/components/molecules/ActivityFeedList";

export enum DrawerState {
  None,
  SelectedGame,
  Activity,
  PersonalStats,
  CreateGame,
}

const GameQueue = () => {
  const [games, setGames] = useState<Wager[]>([]);
  const [loading, setLoading] = useState(true);
  const [statData, setStatData] = useState<Stats | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [activeCard, setActiveCard] = useState<Wager | null>(null);
  const [drawerState, setDrawerState] = useState<DrawerState>(DrawerState.Activity);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showStandingsModal, setShowStandingsModal] = useState(false);
  const [activityFeed, setActivityFeed] = useState<ActivityFeedItem[]>([]);

  useEffect(() => {
    const socket = io(generalConfig.wsUrl);

    socket.on('activityFeed', (activity: ActivityFeedItem) => {
      setActivityFeed((prevFeed) => [activity, ...prevFeed]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

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

  const liveGames = games
    .filter((game: Wager) => game.status === "live")
    .sort((a: Wager, b: Wager) => a.endDate - b.endDate)
    .map((game, index) => {
      return (
        <GameCard
          key={index}
          game={game}
          setDrawerOpen={setDrawerOpen}
          activeCard={activeCard}
          setActiveCard={setActiveCard}
          setDrawerState={setDrawerState}
        />
      );
    });

  const otherGames = games
    .filter((game: Wager) => game.status !== "live")
    .sort((a: Wager, b: Wager) => b.endDate - a.endDate)
    .map((game, index) => {
      return (
        <GameCard
          key={index}
          game={game}
          setDrawerOpen={setDrawerOpen}
          activeCard={activeCard}
          setActiveCard={setActiveCard}
          setDrawerState={setDrawerState}
        />
      );
    });

  const handleDrawerStateChange = (state: DrawerState) => {
    if (drawerState === state) {
      setDrawerState(DrawerState.None);
      setDrawerOpen(false);
      setActiveCard(null);
    } else {
      setDrawerState(state);
      setDrawerOpen(true);
      if (state !== DrawerState.SelectedGame) {
        setActiveCard(null);
      }
    }
  };

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
          <div className="w-full flex items-start justify-between pt-20">
            <motion.div className="flex flex-col gap-5 items-center mx-auto justify-center mt-12 mb-40 z-20">
              {games.length === 0 && (
                <div className="w-full md:w-[620px] flex flex-col items-center justify-center pt-10">
                  <p className="text-center text-lg pt-5">
                    No games available.
                  </p>
                </div>
              )}
              <div className="w-full grid grid-cols-1 gap-2">
                {liveGames}
                {otherGames}
              </div>
            </motion.div>
            <AnimatePresence>
              {drawerOpen && (
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ duration: 0.5 }}
                  className="fixed top-20 right-0 w-[600px] min-h-screen h-full border-l border-border z-40"
                >
                  <motion.div
                    initial={{ x: 64 }}
                    animate={{ x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute top-8 -left-16 z-50 flex flex-col space-y-4"
                  >
                    <button
                      onClick={() => handleDrawerStateChange(DrawerState.Activity)}
                      className={`w-12 h-12 rounded-[10px] flex items-center justify-center ${
                        drawerState === DrawerState.Activity ? "bg-[#DFB78D]" : "bg-[#1F2028]"
                      }`}
                    >
                      <img
                        src={drawerState === DrawerState.Activity ? "/images/icons/chart-bar-solid-sel.svg" : "/images/icons/chart-bar-solid.svg"}
                        alt="Activity"
                        className="w-[16px] h-[16x] fill-current text-[#8E93B4]"
                      />
                    </button>
                    <button
                      onClick={() => handleDrawerStateChange(DrawerState.PersonalStats)}
                      className={`w-12 h-12 rounded-[10px] flex items-center justify-center ${
                        drawerState === DrawerState.PersonalStats ? "bg-[#DFB78D]" : "bg-[#1F2028]"
                      }`}
                    >
                      <img
                        src={drawerState === DrawerState.PersonalStats ? "/images/icons/user-solid-sel.svg" : "/images/icons/user-solid.svg"}
                        alt="Personal Stats"
                        className="w-[16px] h-[16x] fill-current text-[#8E93B4]"
                      />
                    </button>
                    {true && (
                      <button
                        onClick={() => handleDrawerStateChange(DrawerState.CreateGame)}
                        className={`w-12 h-12 rounded-[10px] flex items-center justify-center ${
                          drawerState === DrawerState.CreateGame ? "bg-[#DFB78D]" : "bg-[#1F2028]"
                        }`}
                      >
                        <img
                          src={drawerState === DrawerState.CreateGame ? "/images/icons/plus-solid-sel.svg" : "images/icons/plus-solid.svg"}
                          alt="Create Game"
                          className="w-[16px] h-[16x] fill-current text-[#8E93B4]"
                        />
                      </button>
                    )}
                  </motion.div>
                  {drawerState === DrawerState.SelectedGame && activeCard ? (
                    <div>
                      <h2>Selected Game: {activeCard.title}</h2>
                    </div>
                  ) : drawerState === DrawerState.Activity ? (
                    <div>
                      <h2>Activity</h2>
                      <ActivityFeedList activityFeed={activityFeed} />
                    </div>
                  ) : drawerState === DrawerState.PersonalStats ? (
                    <div>
                      <h2>Personal Stats</h2>
                    </div>
                  ) : drawerState === DrawerState.CreateGame ? (
                    <div>
                      <h2>Create Game</h2>
                    </div>
                  ) : (
                    <div>No content selected</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </AnimatePresence>
      )}
    </div>
  );
};

export const getServerSideProps = withRedirect();
export default GameQueue;