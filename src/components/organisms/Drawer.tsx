import { FC } from "react";
import { DrawerState } from "@/pages/classic";
import { Stats, Wager } from "@/types";
import { ActivityFeedItem } from "@/types/ActivityFeed";
import { useWallet } from "@solana/wallet-adapter-react";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, X } from "lucide-react";
import ActivityDrawerData from "../molecules/ActivityDrawerData";
import SelectedGameData from "../molecules/SelectedGameData";

interface Props {
  setDrawerOpen: (value: boolean) => void;
  data: ActivityFeedItem[] | Stats | Wager | null;
  drawerState: DrawerState;
  setDrawerState: (value: DrawerState) => void;
  loadGameData?: () => void;
}

const Drawer: FC<Props> = ({
  setDrawerOpen,
  data,
  drawerState,
  setDrawerState,
  loadGameData,
}) => {
  const wallet = useWallet();
  return (
    <AnimatePresence>
      {drawerState !== DrawerState.None && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.6 }}
          className="h-screen min-w-[400px] border-l border-border z-40 px-10 py-6"
        >
          <X
            color="white"
            size={18}
            onClick={() => {
              setDrawerOpen(false);
              setDrawerState(DrawerState.None);
            }}
            className="absolute top-8 right-8 cursor-pointer"
          />
          {/* Drawer content based on drawerState */}
          <div className="w-[400px] flex flex-col gap-[30px] justify-center">
            {drawerState === DrawerState.SelectedGame &&
              (data as Wager) &&
              loadGameData && (
                <SelectedGameData
                  data={data as Wager}
                  loadGameData={loadGameData}
                />
              )}
            {drawerState === DrawerState.Activity &&
              (data as ActivityFeedItem[]) && (
                <ActivityDrawerData data={data as ActivityFeedItem[]} />
              )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Drawer;
