import { FC } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { DrawerState } from "@/pages/classic";

interface Props {
  drawerOpen: boolean;
  setDrawerOpen: (value: boolean) => void;
  drawerState: string;
  setDrawerState: (value: DrawerState) => void;
}

const DrawerButtons: FC<Props> = ({
  drawerOpen,
  setDrawerOpen,
  drawerState,
  setDrawerState,
}) => {
  return (
    <motion.div
      className={`flex flex-col mt-4 mr-4 gap-4 absolute ${
        drawerOpen ? "-left-16" : "left-0"
      } top-0`}
    >
      <button
        onClick={() => {
          if (drawerState === DrawerState.Activity) {
            setDrawerOpen(false);
            setDrawerState(DrawerState.None);
          } else {
            setDrawerOpen(true);
            setDrawerState(DrawerState.Activity);
          }
        }}
        className={`w-12 h-12 rounded-[10px] flex items-center justify-center ${
          drawerState === DrawerState.Activity ? "bg-data" : "bg-greyscale6"
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
          className="w-[16px] h-[16x] fill-current text-greyscale4"
        />
      </button>
      <button
        onClick={() => {
          if (drawerState === DrawerState.PersonalStats) {
            setDrawerOpen(false);
            setDrawerState(DrawerState.None);
          } else {
            setDrawerOpen(true);
            setDrawerState(DrawerState.PersonalStats);
          }
        }}
        className={`w-12 h-12 rounded-[10px] flex items-center justify-center ${
          drawerState === DrawerState.PersonalStats
            ? "bg-data"
            : "bg-greyscale6"
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
          className="w-[16px] h-[16x] fill-current text-greyscale4"
        />
      </button>
      {true && (
        <button
          onClick={() => {
            if (drawerState === DrawerState.CreateGame) {
              setDrawerOpen(false);
              setDrawerState(DrawerState.None);
            } else {
              setDrawerOpen(true);
              setDrawerState(DrawerState.CreateGame);
            }
          }}
          className={`w-12 h-12 rounded-[10px] flex items-center justify-center ${
            drawerState === DrawerState.CreateGame ? "bg-data" : "bg-greyscale6"
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
            className="w-[16px] h-[16x] fill-current text-greyscale4"
          />
        </button>
      )}
    </motion.div>
  );
};

export default DrawerButtons;
