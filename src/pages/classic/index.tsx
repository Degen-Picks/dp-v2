import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getWagers } from "../../utils/apiUtil";
import { Navbar, GameFilter, Timer } from "@/components";
import { Wager } from "@/types";

interface Props {
  title: string;
  description: string;
  slug: string;
  status: string;
  gameTime: number;
}

export const PropSection: FC<Props> = ({
  title,
  description,
  slug,
  status,
  gameTime,
}) => {
  return (
    <Link passHref href={`/classic/${encodeURI(slug)}`}>
      <div
        className="relative bg-white py-3 md:h-[100px] w-full md:w-[620px] mx-auto 
        cursor-pointer hover:scale-[1.02] transition-transform ease-in-out duration-500"
      >
        <div className="flex items-center justify-center h-full">
          <div className="w-2/3 mx-auto md:w-auto md:max-w-[300px]">
            <p className="text-center text-base">{description}</p>
            <p className="text-center text-xl text-primary font-base-b">
              {title}
            </p>
            <div className="pt-4 md:hidden flex items-center justify-center gap-2">
              <Timer status={status} gameTime={gameTime} />
              {/* TODO: set up for multiple currencies */}
              <Image
                src="/images/icons/dust_square.png"
                width={30}
                height={30}
                alt="dust"
              />
            </div>
          </div>
        </div>
        <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 right-6 items-center gap-2">
          <Timer status={status} gameTime={gameTime} />
          {/* TODO: set up for multiple currencies */}
          <Image
            src="/images/icons/dust_square.png"
            width={30}
            height={30}
            alt="dust"
          />
        </div>
      </div>
    </Link>
  );
};

const GameQueue = () => {
  const [games, setGames] = useState<Wager[]>([]);
  const [activeFilter, setActiveFilter] = useState(true);

  // this function fetches the status for each game
  const loadGameData = async () => {
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
  };

  useEffect(() => {
    loadGameData();
  }, []);

  return (
    <div className="relative bg-light w-full overflow-hidden min-h-screen pb-20 md:pb-0">
      <Navbar />
      <div className="md:max-w-[1000px] text-center w-[90%] md:w-[3/4] mx-auto mt-10 lg:mt-0">
        <div className="w-fit mx-auto pb-16">
          <p className="text-base">Picks Classic</p>
          <p className="text-[30px] font-bingodilan">Featured Games</p>
        </div>
      </div>
      {/* list of all games, active or inactive */}
      <div className="flex flex-col gap-5 items-start w-[90%] md:w-fit mx-auto justify-center mb-20">
        <GameFilter
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
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
            <p className="text-center text-base">No active games available</p>
          </div>
        )}
        {games
          ?.filter(
            (game) =>
              (activeFilter === true &&
                (game.status === "live" ||
                  game.status === "closed" ||
                  game.status === "upcoming")) ||
              (activeFilter === false &&
                (game.status === "completed" || game.status === "cancelled"))
          )
          .reverse()
          .map((game, index) => {
            return (
              <PropSection
                key={index}
                title={game.title}
                slug={game._id}
                description={game.description!}
                status={game.status}
                gameTime={game.endDate}
              />
            );
          })}
      </div>
      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-secondary">
        © Degen Picks 2023
      </p>
    </div>
  );
};

export default GameQueue;