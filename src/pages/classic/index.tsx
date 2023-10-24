import { useEffect, useState, FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { getCurrencyIcon, getWagers } from "@/utils";
import {
  Navbar,
  GameFilter,
  Timer,
  AlertBanner,
  FallbackImage,
  Crown,
  MovingData,
} from "@/components";
import { Wager, WagerUser } from "@/types";
import { withRedirect } from "@/utils/withRedirect";
import { useWallet } from "@solana/wallet-adapter-react";
import { BarLoader } from "react-spinners";

interface Props {
  title: string;
  description: string;
  slug: string;
  status: string;
  gameTime: number;
  creator: WagerUser;
  token: string | null;
  winner: string | null;
}

export const PropSection: FC<Props> = ({
  title,
  description,
  slug,
  status,
  gameTime,
  creator,
  token,
  winner,
}) => {
  return (
    <Link className="w-full" passHref href={`/${encodeURI(slug)}`}>
      <div
        className="relative bg-greyscale1 py-3 h-[200px] w-full
        px-5 md:px-0 md:w-[380px] mx-auto cursor-pointer border-2 border-transparent hover:border-purple1"
      >
        <div className="flex flex-col items-center gap-[10px] justify-center h-full px-8">
          <p className="text-center text-lg leading-[17px]">{description}</p>
          <p className="text-center text-2xl leading-[25px] font-base-b">
            {title}
          </p>
          <div className="flex items-center justify-center gap-2 mt-[10px]">
            {creator?.roles?.includes("ADMIN") ? (
              <div className="flex items-center gap-[5px]">
                <Image
                  src="/images/team_icon.png"
                  width={16}
                  height={16}
                  alt="dp team icon"
                />
                <p className="uppercase text-lg">dp team</p>
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
                <p className="text-lg">{creator?.twitterData?.username}</p>
              </div>
            ) : null}
            {creator && <div className="h-5 w-[1px] bg-greyscale4" />}
            <Timer status={status} gameTime={gameTime} winner={winner} />
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
            winner={
              game.selections.filter(
                (selection) => selection.winner === true
              )[0]?.title
            }
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
          winner={
            game.selections.filter((selection) => selection.winner === true)[0]
              ?.title
          }
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
          winner={
            game.selections.filter((selection) => selection.winner === true)[0]
              ?.title
          }
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
          winner={
            game.selections.filter((selection) => selection.winner === true)[0]
              ?.title
          }
        />
      );
    });

  useEffect(() => {
    loadGameData();
  }, []);

  return (
    <div className="relative bg-greyscale3 w-full overflow-hidden min-h-screen pb-20 md:pb-0">
      {!loading && (
        <>
          <AlertBanner
            text={
              "Now you can run your own Degen Picks™ pool, and get 50% of the fees."
            }
            ctaText={"Learn More"}
            ctaLink={"https://degenpicks.xyz"}
          />
          <Navbar />
        </>
      )}

      {loading ? (
        <div className="w-fit mx-auto flex flex-col items-center mt-56">
          <BarLoader color="black" />
        </div>
      ) : (
        <div
          className="flex flex-col gap-5 items-center w-[90%] 
          md:w-fit mx-auto justify-center mb-20 z-20"
        >
          <div
            className={`hidden md:block absolute ${
              publicKey ? "top-[92px]" : "top-7"
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
              <p className="text-center text-lg pt-5">
                No live games right now.
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
      <div className="fixed bottom-0 left-0 w-screen z-10">
        {/* <MovingData> */}
        <div className="w-screen bg-[#1B1B1B] flex items-center justify-between px-[50px]">
          <div className="flex items-center">
            <div className="flex items-center justify-center gap-2 border-x border-greyscale1/20 p-5">
              <div className="animate-pulse">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="5" cy="5" r="2" fill="#14F195" />
                  <circle
                    cx="5"
                    cy="5"
                    r="3.5"
                    stroke="#14F195"
                    stroke-opacity="0.15"
                    stroke-width="3"
                  />
                </svg>
              </div>
              <p className="text-greyscale1 text-lg">Live</p>
            </div>
            <div className="flex items-center justify-center gap-5 border-r border-greyscale1/20 p-5">
              <p className="text-greyscale1 text-lg">
                69 <span className="text-greyscale4">pools</span>
              </p>
              <p className="text-greyscale1 text-lg">
                42 <span className="text-greyscale4">players</span>
              </p>
              <p className="text-greyscale1 text-lg">
                420 <span className="text-greyscale4">picks</span>
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-5 border-x border-greyscale1/20 p-5">
            <div className="flex items-center gap-[5px]">
              <Image
                src="/images/icons/solana.png"
                width={24}
                height={24}
                alt="solana"
              />
              <p className="text-greyscale1 text-lg">
                240 <span className="text-greyscale4">SOL</span>
              </p>
            </div>
            <div className="flex items-center gap-[5px]">
              <Image
                src="/images/icons/dust.png"
                width={24}
                height={24}
                alt="dust"
              />
              <p className="text-greyscale1 text-lg">
                42036 <span className="text-greyscale4">DUST</span>
              </p>
            </div>
            <div className="flex items-center gap-[5px]">
              <Image
                src="/images/icons/usdc.png"
                width={24}
                height={24}
                alt="usdc"
              />
              <p className="text-greyscale1 text-lg">
                420 <span className="text-greyscale4">USDC</span>
              </p>
            </div>
            <div className="flex items-center gap-[5px]">
              <Image
                src="/images/icons/crown-logo.png"
                width={24}
                height={24}
                alt="crown"
              />
              <p className="text-greyscale1 text-lg">
                40 <span className="text-greyscale4">CROWN</span>
              </p>
            </div>
          </div>
        </div>
        {/* </MovingData> */}
      </div>
    </div>
  );
};

export const getServerSideProps = withRedirect();
export default GameQueue;
