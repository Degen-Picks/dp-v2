import { useState, useEffect, FC } from "react";
import Image from "next/image";
import { Navbar, DataPoint, Discord, Twitter } from "@/components";
import { getStats } from "../utils/api/apiUtil";
import { Stats } from "@/types";
import { GetServerSideProps, NextPage } from "next/types";
import GameQueue from "./classic";
import { getCurrencyIcon } from "@/utils";
import { motion } from "framer-motion";
import { generalConfig } from "@/configs";
import { useWindowSize } from "@/hooks/useWindowSize";

interface TeamProps {
  handle: string;
  image: string;
}

const TeamMember: FC<TeamProps> = ({ handle, image }) => {
  return (
    <motion.button
      className="flex items-center gap-2 w-fit group"
      onClick={() =>
        window.open(
          `https://twitter.com/${handle}`,
          "_blank",
          "noopener noreferrer"
        )
      }
    >
      <Image
        src={image}
        width={33}
        height={33}
        alt="user image"
        className="rounded-full border border-transparent group-hover:border-purple1"
      />
      <p className="group-hover:text-purple1">{handle}</p>
    </motion.button>
  );
};

const Landing = () => {
  const [statData, setStatData] = useState<Stats>();
  const [mounted, setMounted] = useState(false);

  const [winWidth] = useWindowSize();
  const isMobile = winWidth < 1024;

  const loadStatData = async () => {
    const statData: Stats | null = await getStats();
    if (statData === null) return;

    const { gamesHosted, uniquePlayers, totalVolume } = statData;

    setStatData({
      gamesHosted: gamesHosted,
      uniquePlayers: uniquePlayers,
      totalVolume: totalVolume,
    });
  };

  useEffect(() => {
    async function loadStats() {
      await loadStatData();
    }

    loadStats();
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full relative overflow-y-auto h-screen bg-greyscale3">
      <div className="h-full w-full flex flex-col gap-5">
        <Navbar landing={true} />
        {isMobile ? (
          <div className="w-full h-full flex flex-col flex-1">
            <div className="h-full flex flex-col items-center justify-center gap-5">
              <Image
                src="/images/landing/dp_scuba_mobile.png"
                width={370}
                height={370}
                alt="DP artwork by scuba"
                priority
                className="w-[90%] max-w-[370px] mx-auto"
              />
              <div className="w-full flex justify-center items-center px-5">
                <motion.button
                  className="bg-purple1 text-greyscale1 w-full max-w-[370px] h-[50px] text-lg"
                  onClick={() => window.open(generalConfig.appUrl)}
                >
                  Launch app
                </motion.button>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-[1600px] flex flex-1 mx-auto">
            <div className="w-full h-full flex items-center justify-center">
              <Image
                src="/images/landing/dp_scuba.png"
                width={1880}
                height={1000}
                alt="DP artwork by scuba"
                priority
                className="w-[80%] max-w-[1000px] mx-auto"
              />
            </div>
          </div>
        )}
        <div className="w-full">
          <div className="max-w-[1600px] mx-auto text-greyscale5 text-lg flex items-center justify-center sm:justify-between px-4 sm:px-10 py-5">
            <p>© 2023 Degen Picks</p>
            <div className="hidden sm:flex items-center gap-4">
              <p className="">Follow us</p>
              {/* icons here */}
              <Twitter className="fill-greyscale5 hover:fill-[#333333]" />
              <Discord className="fill-greyscale5 hover:fill-[#333333]" />
            </div>
          </div>
        </div>
      </div>
      {/* <div className="text-center sm:max-w-[1000px] h-screen flex flex-col items-center justify-center gap-5 sm:mx-auto">
        <div className="w-[90%] md:w-[3/4] mx-auto pb-6 -mt-10 sm:mt-0">
          <div className="font-base-b text-[40px] leading-[39px] ">
            Degen Picks
          </div>
          <div className="lg:text-lg px-8 mt-4 max-w-[500px] mx-auto">
            <p>
              Bringing internet friends together with PvP betting pools. Built
              by OG DeGods for the Solana community.
            </p>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-center gap-3 sm:mb-12">
            <p>Tokens:</p>
            <div className="flex items-center gap-1">
              <Image
                src={getCurrencyIcon("DUST")}
                width={24}
                height={24}
                alt="token icon"
                className="rounded-full overflow-hidden"
              />
              <p>DUST</p>
            </div>
            <div className="flex items-center gap-1">
              <Image
                src={getCurrencyIcon("SOL")}
                width={24}
                height={24}
                alt="token icon"
                className="rounded-full overflow-hidden"
              />
              <p>SOL</p>
            </div>
            <div className="flex items-center gap-1">
              <Image
                src={getCurrencyIcon("USDC")}
                width={24}
                height={24}
                alt="token icon"
                className="rounded-full overflow-hidden"
              />
              <p>USDC</p>
            </div>
          </div>
          <div
            className="mt-10 sm:mt-0 max-w-[333px] sm:h-[90px] bg-greyscale5
            flex flex-row justify-between items-center mx-auto"
          >
            {statData !== null && (
              <>
                <DataPoint title="games" value={statData?.gamesHosted!} />
                <DataPoint title="volume" value={statData?.totalVolume!} />
                <DataPoint title="players" value={statData?.uniquePlayers!} />
              </>
            )}
          </div>
        </div>
        <div className="w-[90%] md:w-[3/4] mx-auto sm:pt-5 sm:pb-20">
          <p className="text-center pb-5">Founders</p>
          <div className="grid grid-cols-2 gap-x-10 gap-y-5 w-fit max-w-[500px] mx-auto">
            <TeamMember handle="capsjpeg" image="/images/team/caps.png" />
            <TeamMember handle="misterholana" image="/images/team/h.png" />
            <TeamMember handle="0x_saddy" image="/images/team/saddy.png" />
            <TeamMember handle="matt_degods" image="/images/team/matt.png" />
          </div>
        </div>
      </div> */}
    </div>
  );
};

interface HomePageProps {
  host: string | null;
  path: string | null;
}

const HomePage: NextPage<HomePageProps> = ({ host, path }) => {
  if (host === "app.degenpicks.xyz" || host === "app.staging.degenpicks.xyz") {
    return <GameQueue />;
  }

  return <Landing />;
};

export const getServerSideProps: GetServerSideProps<HomePageProps> = async (
  context
) => {
  const host = context.req.headers.host || null;
  const path = context.req.url || null;
  return { props: { host, path } };
};

export default HomePage;
