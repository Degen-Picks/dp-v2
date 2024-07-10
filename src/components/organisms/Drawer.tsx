import { FC } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import ActivityDrawerData from "../molecules/ActivityDrawerData";
import SelectedGameData from "../molecules/SelectedGameData";
import CreatePool from "../molecules/CreatePool";
import { BetEventResponse, Stats, Wager } from "@/types";
import { DrawerState } from "@/pages/classic";

interface Props {
  drawerState: DrawerState;
  closeDrawer: () => void;
  loadGameData?: () => void;
}

const Drawer: FC<Props> = ({ drawerState, closeDrawer, loadGameData }) => {
  return (
    <AnimatePresence>
      {drawerState.isOpen && (
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
            onClick={closeDrawer}
            className="absolute top-8 right-8 cursor-pointer"
          />
          <div className="w-[400px] flex flex-col gap-[30px] justify-center">
            {drawerState.type === 'selectedGame' && drawerState.content && loadGameData && (
              <SelectedGameData
                data={drawerState.content as Wager}
                loadGameData={loadGameData}
              />
            )}
            {(drawerState.type === 'activity' || drawerState.type === 'personalStats') && drawerState.content && (
              <ActivityDrawerData data={drawerState.content as BetEventResponse} />
            )}
            {drawerState.type === 'createGame' && (
              <CreatePool />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Drawer;