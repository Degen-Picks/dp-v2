import { generalConfig } from "@/configs";
import Image from "next/image";
import { useRouter } from "next/router";
import { FC } from "react";

interface Props {
  classicLive: boolean;
  pickemLive: boolean;
}

const GameOptions: FC<Props> = ({ classicLive, pickemLive }) => {
  const router = useRouter();

  const handleClick = (game: string) => {
    if (game === "classic") {
      router.push(generalConfig.appUrl);
    } else router.push("/pickem");
  };

  return (
    <div className="flex flex-col lg:flex-row justify-center items-center space-y-5 lg:space-y-0 lg:space-x-5 my-20">
      {/* option 1 - degen picks OG */}
      <div
        className="relative overflow-hidden h-[300px] w-[95%] sm:w-[380px] lg:w-[460px] lg:h-[360px] text-center 
        bg-greyscale1 border-2 border-black/30 lg:hover:cursor-pointer lg:hover:border-purple1"
        onClick={() => handleClick("classic")}
      >
        <div className="h-full flex flex-col justify-center">
          <div className="font-base-b text-3xl text-black mt-4">
            Degen Picks
            <br />
            (Classic)
          </div>
          <div className="lg:text-xl mt-4 text-black/60">
            <p>Sports picks on individual</p>
            <p>games, with a degen twist.</p>
            <p>Pick correctly, win DUST.</p>
          </div>
        </div>
        {/* rotating pfps mobile and web view */}
        <div className={`absolute -bottom-2 -left-[136px] lg:-left-24`}>
          <Image
            src={"/images/landing/matt.png"}
            width={250}
            height={316.25}
            alt="matt"
          />
        </div>
        <div className={`absolute -bottom-2 -right-[136px] lg:-right-24`}>
          <Image
            src={"/images/landing/h.png"}
            width={250}
            height={316.25}
            alt="h"
          />
        </div>
        {/* game status */}
        {classicLive === true && (
          <div className="absolute text-sm top-4 lg:top-10 left-1/2 -translate-x-1/2 flex flex-row items-center px-3 py-1 rounded-lg border border-red-400 bg-greyscale1 text-red-500">
            <div className="blob"></div> Live game
          </div>
        )}
      </div>
      {/* option 2 - JB pickem */}
      <div
        className="relative overflow-hidden h-[300px] w-[95%] sm:w-[380px] lg:w-[460px] lg:h-[360px] text-center 
        bg-greyscale1 border-2 border-black/30 lg:cursor-not-allowed opacity-60"
        // onClick={() => handleClick("degen")}
      >
        <div className="h-full flex flex-col justify-center sm:pb-0">
          <div className="font-base-b text-3xl mt-4 px-3 text-black">
            JB&apos;s NFL
            <br />
            Pick&apos;em
          </div>
          <div className="lg:text-xl text-black/60 mt-4">
            <p>
              The 2022-23 season has ended
              <br />
              but the leaderboard legends
              <br />
              live on...
            </p>
          </div>
          {/* {pickemLive === true && (
            <div className="absolute text-sm top-4 lg:top-10 left-1/2 -translate-x-1/2 flex flex-row items-center px-3 py-1 rounded-lg border border-red-400 bg-greyscale1 text-red-500">
              <div className="blob"></div> Live game
            </div>
          )} */}
          <div
            className="absolute text-sm top-4 lg:top-10 left-1/2 -translate-x-1/2 
            flex flex-row items-center px-3 py-1 rounded-lg border text-[#795548] bg-greyscale5"
          >
            Season ended
          </div>
        </div>
        {/* characters */}
        <div className={`absolute -bottom-3 -left-[140px] lg:-left-28`}>
          <Image
            src={"/images/pickem/jb.png"}
            width={260}
            height={300}
            alt="JB PFP"
          />
        </div>
        <div className={`absolute -bottom-2 -right-[130px] lg:-right-24`}>
          <Image
            src={"/images/pickem/saddy_flip.png"}
            width={222}
            height={300}
            alt="SADDY PFP"
          />
        </div>
      </div>
    </div>
  );
};

export default GameOptions;
