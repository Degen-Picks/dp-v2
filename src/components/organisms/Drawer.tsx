import { FC } from "react";
import { DrawerState } from "@/pages/classic";
import { Stats, Wager } from "@/types";
import { ActivityFeedItem } from "@/types/ActivityFeed";
import { useWallet } from "@solana/wallet-adapter-react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

interface Props {
  setDrawerOpen: (value: boolean) => void;
  data: ActivityFeedItem[] | Stats | Wager | null;
  drawerState: DrawerState;
  setDrawerState: (value: DrawerState) => void;
}

const Drawer: FC<Props> = ({
  setDrawerOpen,
  data,
  drawerState,
  setDrawerState,
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
          {drawerState === DrawerState.SelectedGame && (data as Wager) && (
            <div className="w-[400px] flex flex-col gap-5 justify-center">
              <div className="flex flex-col gap-2 justify-center">
                <p className="text-greyscale1 text-[18px] font-base-b pr-10">
                  {(data as Wager).title}
                </p>
                {(data as Wager).description && (
                  <p className="text-greyscale4 text-xs">
                    {(data as Wager).description}
                  </p>
                )}
              </div>
              <div
                className={`w-full flex gap-0.5 h-[70px] ${
                  !wallet.publicKey ? "text-greyscale1/50" : "text-greyscale1"
                }`}
              >
                {(data as Wager).selections?.map((o, index) => (
                  <button
                    key={o._id}
                    disabled={!wallet.publicKey}
                    className={`p-2.5 w-full h-full rounded-[20px] disabled:cursor-not-allowed ${
                      index < 1 && "rounded-r-none"
                    } ${index > 0 && "rounded-l-none"} ${
                      (data as Wager).selections?.find((o) => o.winner)?._id ===
                      o._id
                        ? "bg-[#282622] border border-data"
                        : "bg-greyscale5 hover:bg-greyscale1/10 disabled:hover:bg-greyscale5"
                    }`}
                    // onClick={() => handleSelect(o._id)}
                  >
                    {o.title}
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Drawer;
