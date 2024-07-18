import { useCallback, useContext, useEffect, useState } from "react";
import { getGlobalActivityFeed, getPersonalActivityFeed, getWagers } from "@/utils";
import { GameFilter, GameCard } from "@/components";
import { BetEvent, BetEventResponse, Stats, Wager } from "@/types";
import { withRedirect } from "@/utils/withRedirect";
import { BarLoader } from "react-spinners";
import { AnimatePresence, motion } from "framer-motion";
import NewNavbar from "@/components/organisms/NewNavBar";
import io from "socket.io-client";
import { generalConfig } from "@/configs";
import Drawer from "@/components/organisms/Drawer";
import DrawerButtons from "@/components/molecules/DrawerButtons";
import { WagerUserContext, WagerUserContextType } from "@/components/stores/WagerUserStore";

export interface DrawerState {
  isOpen: boolean;
  type: 'none' | 'activity' | 'personalStats' | 'selectedGame' | 'createGame';
  content: BetEventResponse | Stats | Wager | null;
}

const GameQueue = () => {
  const { wagerUser } = useContext(WagerUserContext) as WagerUserContextType;
  const [games, setGames] = useState<Wager[]>([]);
  const [loading, setLoading] = useState(true);
  const [activityFeed, setActivityFeed] = useState<BetEventResponse>([]);
  const [personalStats, setPersonalStats] = useState<BetEventResponse | null>(null);
  const [activeFilter, setActiveFilter] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const [drawerState, setDrawerState] = useState<DrawerState>({
    isOpen: false,
    type: 'none',
    content: null,
  });

  const updateDrawerState = useCallback((newState: Partial<DrawerState>) => {
    setDrawerState(prevState => ({ ...prevState, ...newState }));
  }, []);

  const closeDrawer = useCallback(() => {
    updateDrawerState({ isOpen: false, type: 'none', content: null });
  }, [updateDrawerState]);

  const openActivityDrawer = useCallback(() => {
    updateDrawerState({ isOpen: true, type: 'activity', content: activityFeed });
  }, [updateDrawerState, activityFeed]);

  const openPersonalStatsDrawer = useCallback(() => {
    updateDrawerState({ isOpen: true, type: 'personalStats', content: personalStats });
  }, [updateDrawerState, personalStats]);

  const openSelectedGameDrawer = useCallback((game: Wager) => {
    updateDrawerState({ isOpen: true, type: 'selectedGame', content: game });
  }, [updateDrawerState]);

  const openCreateGameDrawer = useCallback(() => {
    updateDrawerState({ isOpen: true, type: 'createGame', content: null });
  }, [updateDrawerState]);

  const loadGameData = async () => {
    setLoading(true);
    let gameData: Wager[] | null = await getWagers();
    setGames(gameData ?? []);
    setLoading(false);
  };

  const loadActivityFeed = async () => {
    const activityFeedData = await getGlobalActivityFeed();
    if (activityFeedData !== null) {
      setActivityFeed(activityFeedData);
    }
  };

  const loadPersonalStats = async (userId: string) => {
    const personalStatData: BetEventResponse | null = await getPersonalActivityFeed(userId);
    if (personalStatData !== null) {
      setPersonalStats(personalStatData);
    }
  };

  useEffect(() => {
    loadGameData();
    loadActivityFeed();
  }, []);

  useEffect(() => {
    if (wagerUser) {
      loadPersonalStats(wagerUser._id);
    } else {
      setPersonalStats(null);
    }
  }, [wagerUser]);

  useEffect(() => {
    const socket = io(generalConfig.wsUrl);
    socket.on("activityFeed", (activity: BetEvent) => {
      setActivityFeed((prevFeed) => [activity, ...prevFeed]);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const renderGames = (filterCondition: (game: Wager) => boolean) => {
    return games
      .filter(filterCondition)
      .sort((a, b) => b.endDate - a.endDate)
      .map((game, index) => (
        <GameCard
          key={index}
          game={game}
          isSelected={drawerState.type === 'selectedGame' && drawerState.content === game}
          onSelect={() => openSelectedGameDrawer(game)}
        />
      ));
  };

  const activeLiveGames = renderGames(game => activeFilter && game.status === "live");
  const activeUpcomingGames = renderGames(game => activeFilter && game.status === "upcoming");
  const activeClosedGames = renderGames(game => activeFilter && game.status === "closed");
  const pastGames = renderGames(game => !activeFilter && (game.status === "completed" || game.status === "cancelled"));

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
            {games.filter((game) =>
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
              initial={{ x: drawerState.isOpen ? "100%" : "calc(100% - 64px)" }}
              animate={{ x: drawerState.isOpen ? 0 : "calc(100% - 64px)" }}
              exit={{ x: drawerState.isOpen ? "100%" : "calc(100% - 64px)" }}
              transition={{ duration: 0.5 }}
              className="fixed right-0 top-20 flex gap-4"
            >
              <DrawerButtons
                drawerState={drawerState}
                openActivityDrawer={openActivityDrawer}
                openPersonalStatsDrawer={openPersonalStatsDrawer}
                openCreateGameDrawer={openCreateGameDrawer}
              />
              <Drawer
                drawerState={drawerState}
                closeDrawer={closeDrawer}
                loadGameData={loadGameData}
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