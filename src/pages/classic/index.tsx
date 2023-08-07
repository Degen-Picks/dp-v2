import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getWagers } from "../../utils/apiUtil";
import {
  Navbar,
  GameFilter,
  Timer,
  VerifiedBadge,
  AlertBanner,
} from "@/components";
import { Wager, WagerUser } from "@/types";

interface Props {
  title: string;
  description: string;
  slug: string;
  status: string;
  gameTime: number;
  creator: WagerUser;
}

export const PropSection: FC<Props> = ({
  title,
  description,
  slug,
  status,
  gameTime,
  creator,
}) => {
  return (
    <Link className="w-full" passHref href={`/classic/${encodeURI(slug)}`}>
      <div
        className="relative bg-white py-3 h-[200px] w-full px-5 md:px-0 md:w-[380px] mx-auto 
        cursor-pointer hover:scale-[1.02] transition-transform ease-in-out duration-500"
      >
        <div className="flex flex-col items-center gap-[10px] justify-center h-full px-8">
          <p className="text-center text-lg leading-[17px]">{description}</p>
          <p className="text-center text-2xl leading-[25px] text-primary font-base-b">
            {title}
          </p>
          <div className="flex items-center justify-center gap-2 mt-[10px]">
            {/* TODO: add creator here */}
            <div className="flex items-center gap-1">
              <VerifiedBadge />
              <p className="uppercase">degen picks team</p>
            </div>
            <div className="h-5 w-[1px] bg-secondary" />
            <Timer status={status} gameTime={gameTime} />
            {/* TODO: set up for multiple currencies */}
          </div>
        </div>
        <Image
          src="/images/icons/dust_square2.png"
          width={30}
          height={30}
          alt="dust"
          className="absolute top-3 right-3"
        />
      </div>
    </Link>
  );
};

const GameQueue = () => {
  const [games, setGames] = useState<Wager[]>([]);
  const [activeFilter, setActiveFilter] = useState(true);
  const [loading, setLoading] = useState(true);

  // this function fetches the status for each game
  const loadGameData = async () => {
    setLoading(true);
    let gameData: Wager[] | null = await getWagers();

    if (gameData === null) {
      setGames([]);
      return;
    }

    gameData = gameData.filter((game: Wager) => {
      if (game.metadata && game.metadata.length > 0) {
        const isHiddenData = game.metadata.find((data: any) => data.is_hidden);
        if (isHiddenData && isHiddenData.is_hidden) {
          return false;
        }
      }

      return true;
    });

    setGames(gameData ?? []);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  const activeLiveGames = games
    ?.filter((game: Wager) => activeFilter === true && game.status === "live")
    .sort((a: Wager, b: Wager) => a.endDate - b.endDate)
    .map(
      (game, index) => {
        return (
          <PropSection
            key={index}
            title={game.title}
            slug={game._id}
            description={game.description}
            status={game.status}
            gameTime={game.endDate}
            creator={game.creator}
          />
        );
      }
      // now, sort upcoming games by date
    );

  const activeClosedUpcomingGames = games
    ?.filter(
      (game) =>
        activeFilter === true &&
        (game.status === "closed" || game.status === "upcoming")
    )
    .sort((a: Wager, b: Wager) => a.endDate - b.endDate)
    .map((game, index) => {
      return (
        <PropSection
          key={index}
          title={game.title}
          slug={game._id}
          description={game.description}
          status={game.status}
          gameTime={game.endDate}
          creator={game.creator}
        />
      );
    });

  const pastGames = games
    ?.filter(
      (game) =>
        activeFilter === false &&
        (game.status === "completed" || game.status === "cancelled")
    )
    .reverse()
    .map((game, index) => {
      return (
        <PropSection
          key={index}
          title={game.title}
          slug={game._id}
          description={game.description}
          status={game.status}
          gameTime={game.endDate}
          creator={game.creator}
        />
      );
    });

  useEffect(() => {
    loadGameData();
  }, []);

  return (
    <div className="relative bg-light w-full overflow-hidden min-h-screen pb-20 md:pb-0">
      <AlertBanner
        text={
          "Now you can run your own Degen Picks™ pool, and get a % of the fees."
        }
        ctaText={"Learn More"}
        ctaLink={"https://degenpicks.xyz"}
      />
      <Navbar />
      {/* Fixed y00ts pfps */}
      {/* <div className={`lg:fixed absolute -bottom-2 -left-14 sm:left-0 z-0`}>
        <Image
          src="/images/landing/matt.png"
          width={800 * 0.25}
          height={1012 * 0.25}
          alt="matt wuz here"
        />
      </div>
      <div className={`lg:fixed absolute -bottom-2 -right-14 sm:right-0 z-0`}>
        <Image
          src="/images/landing/h.png"
          width={800 * 0.25}
          height={1012 * 0.25}
          alt="h was here"
        />
      </div> */}
      {/* <div className="md:max-w-[1000px] text-center w-[90%] md:w-[3/4] mx-auto mt-10 lg:mt-0">
        <div className="w-fit mx-auto pb-16">
          <p className="text-base">Picks Classic</p>
          <p className="text-[30px] font-base-b">Featured Games</p>
        </div>
      </div> */}
      {loading ? (
        <div className="w-fit mx-auto mt-20">
          <div className="rotate">
            <Image
              src="/images/pickem/nipple.png"
              width={100}
              height={100}
              alt="nipple spinner"
            />
          </div>
          <p className="text-xl font-base text-center w-fit mx-auto py-10">
            Loading ...
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-5 items-center w-[90%] md:w-fit mx-auto justify-center mb-20 z-20">
          <div className="hidden md:block absolute top-24 left-1/2 -translate-x-1/2">
            <GameFilter
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
            />
          </div>
          <div className="md:hidden mt-6">
            <GameFilter
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
            />
          </div>
          {games?.filter(
            (game) =>
              (activeFilter === true &&
                (game.status === "live" ||
                  game.status === "closed" ||
                  game.status === "upcoming")) ||
              (activeFilter === false &&
                (game.status === "completed" || game.status === "cancelled"))
          ).length === 0 && (
            <div className="w-full md:w-[620px] flex flex-col items-center justify-center pt-10">
              <Image
                src="/images/landing/nippie_countdown.svg"
                alt="nippie"
                width={200}
                height={200}
              />
              <p className="text-center text-[22px] font-base-b pt-5">
                No games right now.
              </p>
            </div>
          )}
          {/* live games always go first, sorted by date */}
          <div
            className={`w-full grid grid-cols-1 md:grid-cols-2 gap-5 mt-10 md:mt-14`}
          >
            {activeLiveGames}
            {activeClosedUpcomingGames}
          </div>
          {/* past games always go last, sorted by date */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5 mt-10 md:mt-20">
            {pastGames}
          </div>
        </div>
      )}

      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-secondary z-50">
        © Degen Picks 2023
      </p>
    </div>
  );
};

export default GameQueue;
