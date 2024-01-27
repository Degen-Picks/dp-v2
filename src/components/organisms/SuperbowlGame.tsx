import { FC, useEffect, useState } from "react";
import { motion } from "framer-motion";
import SuperbowlPick from "../atoms/SuperbowlPick";
import { SuperbowlGameCard } from "@/types/Superbowl";
import { Pickem } from "@/types";
import { getPickems, sleep, updatePick } from "@/utils";
import sendTransaction from "@/utils/sendTransaction";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { generalConfig } from "@/configs";

interface Props {
  isAdmin?: boolean;
  gameCard: SuperbowlGameCard | null;
  setGameCard:  (gameCard: SuperbowlGameCard) => void;
  currentPick: Pickem | null;
  placedPicks: any[];
  loadUserPicks: () => void;
}

const SuperbowlGame: FC<Props> = ({ isAdmin, gameCard, setGameCard, currentPick, placedPicks, loadUserPicks }) => {
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();

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

  const handlePayToken = async () => {
    if (!currentPick || !gameCard) return;

    console.log("Submitting pickem entry...");
    console.log(gameCard, currentPick);

    // Do we want toasts?

    // We wanna make sure every input is filled out

    // Send dust to our wallet
    const txHash = await sendTransaction(
      publicKey!,
      signTransaction,
      connection,
      currentPick.entryFee,
      currentPick.publicKey,
      "DUST"
    );

    const selectedTeams = Object.keys(gameCard).reduce((acc, key) => {
      if (key !== "tiebreaker") {
        const card = gameCard[key as keyof SuperbowlGameCard];
        if (card.answer !== null && card.answer !== undefined) {
          acc.push(card.answer);
        }
      }
      return acc;
    }, [] as string[]);

    // TODO: Make sure we have tiebreaker.answer
    const tieBreaker = parseInt(gameCard.tiebreaker.answer!); // TODO: patch (!)

    // Check tx went through
    if (
      txHash &&
      (await sendPlaceBet(txHash, selectedTeams as string[], tieBreaker, 0))
    ) {
      await loadUserPicks();
      alert("Success!");
    } else {
      alert("Something went wrong, please try again later.");
    }
  };

  const sendPlaceBet = async (
    signature: string,
    pickedTeams: Array<string>,
    tieBreaker: number,
    retries: number
  ): Promise<any> => {
    if (!currentPick || !publicKey) return;

    try {
      const headers = new Headers();
      headers.append("Content-Type", "application/json");

      const requestOptions = {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          pickId: currentPick._id,
          pickedTeams,
          tieBreaker,
          signature,
        }),
      };

      const response = await fetch(
        `${generalConfig.apiUrl}/api/placePick`,
        requestOptions
      );
      const body = await response.json();

      if (response.status === 200) {
        return true;
      } else {
        if (body.message === "Invalid transaction signature" || retries < 5) {
          console.log("Should retry!");

          await sleep(1000);
          return await sendPlaceBet(
            signature,
            pickedTeams,
            tieBreaker,
            retries + 1
          );
        }

        // TODO: toast?
        // toast.error(body.message);
        return false;
      }
    } catch (err) {
      console.log(`Error placing bet ${err}`);
      return false;
    }
  };

  return (
    <motion.div
      className="w-fit mx-auto h-full flex flex-col flex-1 gap-[60px] items-center justify-center"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {currentPick && (
        <p className="text-greyscale1/50 font-figtree-semi text-center">
          DEBUG: You have {placedPicks.length} picks submitted worth{" "}
          {placedPicks.length * currentPick!.entryFee} total
        </p>
      )}
      <div className="flex flex-col items-center gap-5">
        {gameCard &&
          Object.keys(gameCard).map((key) => {
            const card = gameCard[key as keyof SuperbowlGameCard];
            if (!card.option1 || !card.option2) {
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
                options={[card.option1, card.option2]}
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
      {/* If not admin show submit button */}
      {!isAdmin && (
        <button
          className="bg-data text-greyscale6 text-lg w-[460px] h-[60px] 
          hover:bg-data/80 font-figtree-semi p-2.5 rounded-[20px] mb-20"
          onClick={() => handlePayToken()}
        >
          Submit Pick&apos;em Entry
        </button>
      )}
    </motion.div>
  );
};

export default SuperbowlGame;
