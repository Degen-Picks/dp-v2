
import { FC } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { DrawerState } from "@/pages/classic";

interface Props {
  drawerState: DrawerState;
  openActivityDrawer: () => void;
  openPersonalStatsDrawer: () => void;
  openCreateGameDrawer: () => void;
}

const DrawerButtons: FC<Props> = ({
  drawerState,
  openActivityDrawer,
  openPersonalStatsDrawer,
  openCreateGameDrawer,
}) => {
  return (
    <motion.div
      className={`flex flex-col mt-4 mr-4 gap-4 absolute ${
        drawerState.isOpen ? "-left-16" : "left-0"
      } top-0`}
    >
      <button
        onClick={openActivityDrawer}
        className={`w-12 h-12 rounded-[10px] flex items-center justify-center ${
          drawerState.type === 'activity' ? "bg-data" : "bg-greyscale6"
        }`}
      >
        <Image
          src={
            drawerState.type === 'activity'
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
        onClick={openPersonalStatsDrawer}
        className={`w-12 h-12 rounded-[10px] flex items-center justify-center ${
          drawerState.type === 'personalStats' ? "bg-data" : "bg-greyscale6"
        }`}
      >
        <Image
          src={
            drawerState.type === 'personalStats'
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
          onClick={openCreateGameDrawer}
          className={`w-12 h-12 rounded-[10px] flex items-center justify-center ${
            drawerState.type === 'createGame' ? "bg-data" : "bg-greyscale6"
          }`}
        >
          <Image
            src={
              drawerState.type === 'createGame'
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