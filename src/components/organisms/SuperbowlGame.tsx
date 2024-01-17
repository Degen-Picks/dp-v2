import { FC, useEffect, useState } from "react";
import { motion } from "framer-motion";
import SuperbowlPick from "../atoms/SuperbowlPick";
import { SuperbowlGameCard } from "@/types/Superbowl";
import { Pickem } from "@/types";
import { getPickems, sleep } from "@/utils";
import sendTransaction from "@/utils/sendTransaction";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { generalConfig } from "@/configs";

const SuperbowlGame: FC = () => {
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  
  const [gameCard, setGameCard] = useState<SuperbowlGameCard>({
    anthem: {
      title: "National Anthem",
      answer: null,
      option1: {
        title: "Over",
        _id: "1"
      },
      option2: {
        title: "Under",
        _id: "2"
      }
    },
    coinToss: {
      title: "Coin Toss",
      answer: null,
      option1: {
        title: "Heads",
        _id: "1"
      },
      option2: {
        title: "Tails",
        _id: "2"
      }
    },
    firstScore: {
      title: "First Touchdown",
      answer: null,
      option1: {
        title: "Bills",
        _id: "1"
      },
      option2: {
        title: "49ers",
        _id: "2"
      }
    },
    halftime: {
      title: "Halftime Show ft. Usher",
      answer: null,
      option1: {
        title: "Over",
        _id: "1"
      },
      option2: {
        title: "Under",
        _id: "2"
      }
    },
    gameWinner: {
      title: "Game Winner",
      answer: null,
      option1: {
        title: "Bills",
        _id: "1"
      },
      option2: {
        title: "49ers",
        _id: "2"
      }
    },
    tiebreaker: {
      title: "TIEBREAKER: Total Points",
      answer: ""
    }
  });

  const [currentPick, setCurrentPick] = useState<Pickem | null>(null);
  const [placedPicks, setPlacedPicks] = useState<any[]>([]); // TODO: implement (fetch users selections from db)

  // For popup
  useEffect(() => {
    const loadPickems = async () => {
      const pickems = await getPickems();
      if (pickems === null) return;
      if(pickems.length === 0) return;      

      const currPick = pickems[pickems.length - 1];
      console.log(`Found ya pickem:`,currPick);

      setCurrentPick(currPick);

      // Convert to gameCard
      const gameCard = convertToGameCard(currPick);
      setGameCard(gameCard);
    };

    loadPickems();
  }, []);

  useEffect(() => {
    if (!currentPick || !publicKey) return;

    loadUserPicks();
  }, [currentPick, publicKey]);

  const loadUserPicks = async () => {
    try {
      const headers = new Headers();
      headers.append("Content-Type", "application/json");

      const requestOptions = {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          pickId: currentPick?._id,
          publicKey,
        }),
      };

      const response = await fetch(
        `${generalConfig.apiUrl}/api/getUserPick`,
        requestOptions
      );
      const body = await response.json();

      if (response.status === 200 && body.data.length >= 1) {
        const userPicks = body.data;
        console.log("User picks:", userPicks);
        setPlacedPicks(userPicks);
      }
    } catch (err) {
      console.log(`Error loading user pick ${err}`);
    }
  }

  const convertToGameCard = (data: Pickem) => {
    const gameCard: SuperbowlGameCard = {};
  
    data.selections.forEach(selection => {
      const gameCardKey = selection.name;

      // TODO: will need to change if we do 3+ options
      gameCard[gameCardKey] = {
        title: selection.title,
        answer: null,
        option1: { title: selection.teams[0]?.name, _id: selection.teams[0]?._id },
        option2: { title: selection.teams[1]?.name, _id: selection.teams[1]?._id },
      };
  
      if (gameCardKey === 'tiebreaker') {
        gameCard[gameCardKey] = {
          title: selection.title,
          answer: '',
        };
      }
    });
  
    return gameCard;
  };

  const handlePayToken = async () => {
    if (!currentPick) return;

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
    if (txHash && (await sendPlaceBet(txHash, (selectedTeams as string[]), tieBreaker, 0))) {
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
          signature
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
          return await sendPlaceBet(signature, pickedTeams, tieBreaker, retries + 1);
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
            DEBUG: You have {placedPicks.length} picks submitted worth {placedPicks.length * currentPick!.entryFee} total
          </p>
      )}
      <div className="grid grid-flow-row grid-cols-2 md:grid-cols-2 md:gap-x-5 md:gap-y-8">   
        {Object.keys(gameCard).map((key) => {
          const card = gameCard[key as keyof SuperbowlGameCard];
          if (key === "tiebreaker")
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
      </div>
      <button
        className="bg-data text-greyscale5 text-lg w-[460px] h-[60px] 
        hover:bg-data/80 font-figtree-semi p-2.5 rounded-[10px]"
        onClick={() => handlePayToken()}
      >
        Submit Pick&apos;em Entry
      </button>
    </motion.div>
  );
};

export default SuperbowlGame;
