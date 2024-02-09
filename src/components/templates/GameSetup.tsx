import { FC, useContext, useEffect, useState } from "react";
import {
  BackButton,
  Navbar,
  CreateModal,
  ClassicSetup,
  SuperbowlSetup,
} from "@/components";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/router";
import { generalConfig } from "@/configs";
import { motion } from "framer-motion";
import {
  WagerUserContext,
  WagerUserContextType,
} from "../stores/WagerUserStore";

export enum SetupTabs {
  CLASSIC = "Classic",
  SUPERBOWL = "Superbowl",
}

const GameSetup: FC = () => {
  // hooks
  const { publicKey } = useWallet();
  const router = useRouter();
  const { wagerUser } = useContext(WagerUserContext) as WagerUserContextType;

  // state
  const [tab, setTab] = useState<SetupTabs>(SetupTabs.CLASSIC);
  const [showModal, setShowModal] = useState(false);

  // useEffect(() => {
  //   if (publicKey) {
  //     setShowModal(true);
  //   }
  // }, [publicKey]);

  return (
    <>
      <div className="w-full min-h-screen">
        {/* <Navbar /> */}
        <div className="relative sm:w-[400px] mx-auto pb-20 px-4 sm:px-0">
          <div className="absolute left-4 md:-left-32 -top-14">
            <BackButton
              text="All games"
              handleClick={() => router.push(generalConfig.appUrl)}
            />
          </div>
          <div className="absolute right-4 md:-right-32 -top-14">
            <div
              className={`h-[38px] flex items-center gap-1 p-1 bg-greyscale1`}
            >
              <motion.button
                className={`${
                  tab === SetupTabs.CLASSIC
                    ? "bg-greyscale6 text-greyscale1"
                    : "bg-transparent hover:bg-greyscale2"
                } w-[120px] h-[40px] flex flex-col items-center justify-center`}
                onClick={() => setTab(SetupTabs.CLASSIC)}
              >
                Classic
              </motion.button>
              <motion.button
                className={`${
                  tab === SetupTabs.SUPERBOWL
                    ? "bg-greyscale6 text-greyscale1"
                    : "bg-transparent  hover:bg-greyscale2"
                } w-[120px] h-[40px] flex flex-col items-center justify-center`}
                onClick={() => setTab(SetupTabs.SUPERBOWL)}
              >
                SuperBowl LVIII
              </motion.button>
            </div>
          </div>
          <div className="my-16">
            <div className="w-fit mx-auto lg:mb-0">
              <div className="font-base-b text-center text-3xl text-black">
                Game Setup
              </div>
            </div>
          </div>
          {!publicKey && (
            <div className="w-full h-full flex justify-center items-center mt-20">
              Connect your wallet & Twitter/X to create a pool.
            </div>
          )}
          {publicKey && !!wagerUser && wagerUser?.roles.includes("CREATOR") && (
            <>
              <div className={`${tab !== SetupTabs.CLASSIC && "hidden"}`}>
                <ClassicSetup setShowModal={setShowModal} />
              </div>
              <div className={`${tab !== SetupTabs.SUPERBOWL && "hidden"} `}>
                <SuperbowlSetup setShowModal={setShowModal} />
              </div>
            </>
          )}
        </div>
      </div>
      <CreateModal showModal={showModal} setShowModal={setShowModal} />
    </>
  );
};

export default GameSetup;
