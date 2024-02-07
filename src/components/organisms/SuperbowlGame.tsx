import { FC, useEffect } from "react";
import { motion } from "framer-motion";
import SuperbowlPick from "../atoms/SuperbowlPick";
import { SuperbowlGameCard, SuperbowlOption } from "@/types/Superbowl";
import { Pickem } from "@/types";
import { updatePick } from "@/utils";

interface Props {
  isAdmin?: boolean;
  gameCard: SuperbowlGameCard | null;
  setGameCard: (gameCard: SuperbowlGameCard) => void;
  currentPick: Pickem | null;
}

const SuperbowlGame: FC<Props> = ({
  isAdmin,
  gameCard,
  setGameCard,
  currentPick,
}) => {
  const handleUpdatePickem = async () => {
    if (!currentPick || !gameCard) return;

    const pickId = currentPick._id;

    // get all team ids that are selected
    const selectedTeams = Object.keys(gameCard).reduce((acc, key) => {
      if (key !== "tiebreaker") {
        const card = gameCard[key as keyof SuperbowlGameCard];
        if (card.answer !== null && card.answer !== undefined) {
          acc.push(card.answer);
        }
      }
      return acc;
    }, [] as string[]);

    const tieBreaker =
      parseInt(gameCard.tiebreaker.answer!) > 0
        ? parseInt(gameCard.tiebreaker.answer!)
        : undefined; // TODO: patch (!)
    const result = await updatePick(pickId, selectedTeams, tieBreaker);
    alert(result.message);
  };

  return (
    <motion.div
      className="w-full md:w-fit mx-auto h-full flex flex-col 
      flex-1 gap-[60px] items-center justify-center my-10 px-5 md:px-0"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="w-full flex flex-col items-center gap-5 pb-20">
        {gameCard &&
          Object.keys(gameCard).map((key) => {
            const card = gameCard[key as keyof SuperbowlGameCard];
            const options = Object.keys(card)
              .filter((key): key is keyof typeof card =>
                key.startsWith("option")
              )
              .map((key) => card[key as keyof typeof card]);
            if (options === null) {
              return (
                <SuperbowlPick
                  key={key}
                  accessor={key as keyof SuperbowlGameCard}
                  title={card.title}
                  gameCard={gameCard}
                  setGameCard={setGameCard}
                />
              );
            }

            return (
              <SuperbowlPick
                key={key}
                accessor={key as keyof SuperbowlGameCard}
                title={card.title}
                options={options as SuperbowlOption[]}
                gameCard={gameCard}
                setGameCard={setGameCard}
              />
            );
          })}
      </div>
      {/* If admin show save button */}
      {isAdmin && (
        <button
          className="bg-data text-greyscale6 text-lg w-[460px] h-[60px] 
          hover:bg-data/80 font-figtree-semi p-2.5 rounded-[20px]"
          onClick={() => handleUpdatePickem()}
        >
          UPDATE WINNERS
        </button>
      )}
    </motion.div>
  );
};

export default SuperbowlGame;
