import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getCurrencyIcon, getWagers } from "@/utils";
import {
  Navbar,
  GameFilter,
  Timer,
  VerifiedBadge,
  AlertBanner,
  FallbackImage,
} from "@/components";
import { Wager, WagerUser } from "@/types";
import { withRedirect } from "@/utils/withRedirect";
import { useWallet } from "@solana/wallet-adapter-react";

interface Props {
  title: string;
  description: string;
  slug: string;
  status: string;
  gameTime: number;
  creator: WagerUser;
  token: string | null;
}

export const PropSection: FC<Props> = ({
  title,
  description,
  slug,
  status,
  gameTime,
  creator,
  token,
}) => {
  return (
    <Link className="w-full" passHref href={`/${encodeURI(slug)}`}>
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
            {creator?.roles?.includes("ADMIN") ? (
              <div className="flex items-center gap-[5px]">
                <VerifiedBadge />
                <p className="uppercase">degen picks team</p>
              </div>
            ) : creator?.twitterData ? (
              <div className="flex items-center gap-[5px]">
                <FallbackImage
                  src={creator.twitterData.profileImage}
                  fallbackSrc={"/images/icons/user-alt.png"}
                  width={24}
                  height={24}
                  alt="user image"
                />
                <p className="text-base">{creator?.twitterData?.username}</p>
              </div>
            ) : null}
            {creator && <div className="h-5 w-[1px] bg-secondary" />}
            <Timer status={status} gameTime={gameTime} />
          </div>
        </div>
        <Image
          src={getCurrencyIcon(token)}
          width={24}
          height={24}
          alt="token icon"
          className="absolute top-2.5 right-2.5"
        />
      </div>
    </Link>
  );
};

const GameQueue = () => {
  const [games, setGames] = useState<Wager[]>([]);
  const [activeFilter, setActiveFilter] = useState(true);
  const [loading, setLoading] = useState(true);

  const { publicKey } = useWallet();

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
            token={game.token}
          />
        );
      }
      // now, sort upcoming games by date
    );

  const activeClosedGames = games
    ?.filter((game) => activeFilter === true && game.status === "closed")
    .sort((a: Wager, b: Wager) => b.endDate - a.endDate)
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
          token={game.token}
        />
      );
    });

  const activeUpcomingGames = games
    ?.filter((game) => activeFilter === true && game.status === "upcoming")
    .sort((a: Wager, b: Wager) => b.endDate - a.endDate)
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
          token={game.token}
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
          token={game.token}
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
          "Now you can run your own Degen Picks™ pool, and get 50% of the fees."
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
          {/* <div className="rotate">
            <Image
              src="/images/pickem/nipple.png"
              width={100}
              height={100}
              alt="nipple spinner"
            />
          </div> */}
          <p className="text-xl font-base text-center w-fit mx-auto py-10">
            Loading ...
          </p>
        </div>
      ) : (
        <div
          className="flex flex-col gap-5 items-center w-[90%] 
          md:w-fit mx-auto justify-center mb-20 z-20"
        >
          <div
            className={`hidden md:block absolute ${
              publicKey ? "top-[84px]" : "top-7"
            }  left-1/2 -translate-x-1/2`}
          >
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
          {activeFilter === true ? (
            <div
              className={`w-full grid grid-cols-1 md:grid-cols-2 gap-5 mt-10 md:mt-14`}
            >
              {activeLiveGames}
              {activeUpcomingGames}
              {activeClosedGames}
            </div>
          ) : (
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5 mt-10 md:mt-14">
              {pastGames}
            </div>
          )}
        </div>
      )}

      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-secondary z-50">
        © Degen Picks 2023
      </p>
    </div>
  );
};

export const getServerSideProps = withRedirect();
export default GameQueue;
