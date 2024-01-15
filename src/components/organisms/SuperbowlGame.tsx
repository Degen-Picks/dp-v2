import { FC, useState } from "react";
import { motion } from "framer-motion";
import SuperbowlPick from "../atoms/SuperbowlPick";
import { SuperbowlGameCard } from "@/types/Superbowl";

const SuperbowlGame: FC = () => {
  const [gameCard, setGameCard] = useState<SuperbowlGameCard>({
    anthem: {
      title: "National Anthem",
      answer: null,
      option1: "Over",
      option2: "Under",
    },
    coinToss: {
      title: "Coin Toss",
      answer: null,
      option1: "Heads",
      option2: "Tails",
    },
    firstScore: {
      title: "First Touchdown",
      answer: null,
      option1: "Bills",
      option2: "49ers",
    },
    halftime: {
      title: "Halftime Show ft. Usher",
      answer: null,
      option1: "Over",
      option2: "Under",
    },
    gameWinner: {
      title: "Game Winner",
      answer: null,
      option1: "Bills",
      option2: "49ers",
    },
    tiebreaker: {
      title: "TIEBREAKER: Total Points",
      answer: "",
    },
  });

  return (
    <motion.div
      className="w-fit mx-auto h-full flex flex-col flex-1 gap-[60px] items-center justify-center"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="grid grid-flow-row grid-cols-2 md:grid-cols-2 md:gap-x-5 md:gap-y-8">
        {Object.keys(gameCard).map((key) => {
          const card = gameCard[key as keyof SuperbowlGameCard];
          if (typeof card.answer === "string")
            return (
              <SuperbowlPick
                key={key}
                accessor={key as keyof SuperbowlGameCard}
                title={card.title}
                gameCard={gameCard}
                setGameCard={setGameCard}
              />
            );

          return (
            <SuperbowlPick
              key={key}
              accessor={key as keyof SuperbowlGameCard}
              title={card.title}
              option1={card.option1}
              option2={card.option2}
              gameCard={gameCard}
              setGameCard={setGameCard}
            />
          );
        })}
        {/* <SuperbowlPick
          title="National Anthem"
          option1="Over"
          option2="Under"
          setGameCard={setGameCard}
        />
        <SuperbowlPick
          title="Coin Toss"
          option1="Heads"
          option2="Tails"
          setGameCard={setGameCard}
        />
        <SuperbowlPick
          title="First Touchdown"
          option1="Bills"
          option2="49ers"
          setGameCard={setGameCard}
        />
        <SuperbowlPick
          title="Halftime Show ft. Usher"
          option1="Over"
          option2="Under"
          setGameCard={setGameCard}
        />
        <SuperbowlPick
          title="Game Winner"
          option1="Bills"
          option2="49ers"
          setGameCard={setGameCard}
        />
        <SuperbowlPick
          title="TIEBREAKER: Total Points"
          option1="Bills"
          option2="49ers"
          setGameCard={setGameCard}
        /> */}
      </div>
      <button
        className="bg-data text-greyscale5 text-lg w-[460px] h-[60px] 
        hover:bg-data/80 font-figtree-semi p-2.5 rounded-[10px]"
        onClick={() => console.log(gameCard)}
      >
        Submit Pick&apos;em Entry
      </button>
    </motion.div>
  );
};

export default SuperbowlGame;
