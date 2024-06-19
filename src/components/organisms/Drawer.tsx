import { FC } from "react";
import Image from "next/image";
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
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.5 }}
        className="relative w-[400px] h-screen border-l border-border z-40 px-10 py-6"
      >
        <motion.div
          initial={{ x: 64 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute top-8 -left-20 z-50 flex flex-col space-y-4"
        >
          <button
            onClick={() => setDrawerState(DrawerState.Activity)}
            className={`w-12 h-12 rounded-[10px] flex items-center justify-center ${
              drawerState === DrawerState.Activity
                ? "bg-[#DFB78D]"
                : "bg-[#1F2028]"
            }`}
          >
            <Image
              src={
                drawerState === DrawerState.Activity
                  ? "/images/icons/chart-bar-solid-sel.svg"
                  : "/images/icons/chart-bar-solid.svg"
              }
              width={13}
              height={14}
              alt="Activity"
              className="w-[16px] h-[16x] fill-current text-[#8E93B4]"
            />
          </button>
          <button
            onClick={() => setDrawerState(DrawerState.PersonalStats)}
            className={`w-12 h-12 rounded-[10px] flex items-center justify-center ${
              drawerState === DrawerState.PersonalStats
                ? "bg-[#DFB78D]"
                : "bg-[#1F2028]"
            }`}
          >
            <Image
              src={
                drawerState === DrawerState.PersonalStats
                  ? "/images/icons/user-solid-sel.svg"
                  : "/images/icons/user-solid.svg"
              }
              width={13}
              height={14}
              alt="Personal Stats"
              className="w-[16px] h-[16x] fill-current text-[#8E93B4]"
            />
          </button>
          {true && (
            <button
              onClick={() => setDrawerState(DrawerState.CreateGame)}
              className={`w-12 h-12 rounded-[10px] flex items-center justify-center ${
                drawerState === DrawerState.CreateGame
                  ? "bg-[#DFB78D]"
                  : "bg-[#1F2028]"
              }`}
            >
              <Image
                src={
                  drawerState === DrawerState.CreateGame
                    ? "/images/icons/plus-solid-sel.svg"
                    : "images/icons/plus-solid.svg"
                }
                width={13}
                height={14}
                alt="Create Game"
                className="w-[16px] h-[16x] fill-current text-[#8E93B4]"
              />
            </button>
          )}
        </motion.div>
        <X
          color="white"
          size={18}
          onClick={() => setDrawerOpen(false)}
          className="absolute top-10 right-10 cursor-pointer"
        />

        {/* variable content goes here based on type of incoming data */}
        {/* {drawerState === DrawerState.SelectedGame && (
          <div className="flex flex-col gap-5 justify-center">
            <div className="flex flex-col gap-2 justify-center">
              <p className="text-greyscale1 text-[18px] font-base-b">
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
              {(data as Wager).selections.map((o, index) => (
                <button
                  key={o._id}
                  disabled={!wallet.publicKey}
                  className={`p-2.5 w-full h-full rounded-[20px] disabled:cursor-not-allowed ${
                    index < 1 && "rounded-r-none"
                  } ${index > 0 && "rounded-l-none"} ${
                    (data as Wager).selections.find((o) => o.winner)?._id ===
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
        )} */}
      </motion.div>
    </AnimatePresence>
  );
};

export default Drawer;
