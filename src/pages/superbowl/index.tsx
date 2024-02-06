import { FC, useEffect, useState } from "react";
import Navbar from "@/components/organisms/Navbar";
import SuperbowlRules from "@/components/organisms/SuperbowlRules";
import SuperbowlGame from "@/components/organisms/SuperbowlGame";
import SuperbowlStandings from "@/components/organisms/SuperbowlStandings";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { generalConfig } from "@/configs";
import { Pickem } from "@/types";
import { SuperbowlGameCard, SuperbowlLeaderboard } from "@/types/Superbowl";
import { getPickems, sleep } from "@/utils";
import SuperbowlFooter from "@/components/organisms/SuperbowlFooter";
import { useQuery } from "@tanstack/react-query";
import sendTransaction from "@/utils/sendTransaction";

export enum View {
  RULES = "Home",
  GAME = "Play",
  STANDINGS = "Standings",
  ADMIN = "Admin",
}

const Superbowl: FC = () => {
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();

  const [view, setView] = useState<View>(View.RULES);
  const [numPicks, setNumPicks] = useState<number>(0);

  const [gameCard, setGameCard] = useState<SuperbowlGameCard | null>(null);
  const [currentPick, setCurrentPick] = useState<Pickem | null>(null);
  const [leaderboard, setLeaderboard] = useState<SuperbowlLeaderboard | null>(
    null
  );

  const {
    data: pickemData,
    isLoading: pickemLoading,
    refetch: reloadUserPicks,
  } = useQuery({
    queryKey: ["pickems"],
    queryFn: getPickems,
  });

  const { data: placedPicks, isLoading: placedPicksLoading } = useQuery({
    queryKey: ["placedPicks", currentPick?._id],
    queryFn: async () => {
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

        if (response.status === 200) {
          const userPicks = body.data;
          console.log("User picks:", userPicks);
          return userPicks;
        }
      } catch (err) {
        console.log(`Error loading user pick ${err}`);
      }
    },
    enabled: !!currentPick && !!publicKey,
  });

  // For popup
  useEffect(() => {
    if (!pickemData || pickemData.length === 0) return;

    const currPick = pickemData[pickemData.length - 1];
    console.log(`Found this pickem:`, currPick);

    // Load leaderboard for pick
    loadLeaderboard(currPick._id);

    // Convert to gameCard
    const gameCard = convertToGameCard(currPick, false);

    setCurrentPick(currPick);
    setGameCard(gameCard);
  }, [pickemData]);

  useEffect(() => {
    if (!currentPick) return;

    // Kind of janky right now... but only for admins
    if (view === View.ADMIN) {
      const gameCard = convertToGameCard(currentPick, true);
      setGameCard(gameCard);
    } else if (view === View.STANDINGS) {
      // Reload leaderboard on view switch
      
      // TODO: reload currentPick to update winners?
      loadLeaderboard(currentPick._id);
    }
  }, [view, currentPick]);

  const loadLeaderboard = async (pickId: string) => {
    try {
      const headers = new Headers();
      headers.append("Content-Type", "application/json");

      const requestOptions = {
        method: "GET",
        headers: headers,
      };

      const response = await fetch(
        `${generalConfig.apiUrl}/api/leaderboard_pickem?pickId=${pickId}`,
        requestOptions
      );
      const body = await response.json();

      if (response.status === 200 && body.data.length >= 1) {
        const leaderboard = body.data;
        setLeaderboard(leaderboard);
      }
    } catch (err) {
      console.log(`Error loading leaderboard for pick ${pickId} ${err}`);
    }
  };

  const convertToGameCard = (data: Pickem, isAdmin: boolean) => {
    const gameCard: SuperbowlGameCard = {};

    data.selections.forEach((selection) => {
      const gameCardKey = selection.name;
      let answer: string | null = null;

      // If admin, show already selected options
      if (isAdmin) {
        const winningTeam = selection.teams.find((team) => team.winner);
        answer = winningTeam ? winningTeam._id : null;
      }

      // initialize gameCard
      gameCard[gameCardKey] = {
        title: selection.title,
        answer,
      };

      selection.teams.forEach((team, index) => {
        const optionKey = `option${index + 1}` as `option${number}`;
        gameCard[gameCardKey][optionKey] = {
          title: team.name,
          _id: team._id,
        };
      });

      if (gameCardKey === "tiebreaker") {
        gameCard[gameCardKey].answer = "";
      }
    });

    return gameCard;
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
      await reloadUserPicks();
      alert("Success!");
    } else {
      alert("Something went wrong, please try again later.");
    }
  };

  return (
    <div className="w-screen min-h-screen flex flex-col bg-greyscale6">
      <Navbar view={view} setView={setView} />
      <div className="w-full max-w-[620px] mx-auto flex flex-col flex-1 items-center">
        {view === View.RULES && <SuperbowlRules />}
        {(view === View.GAME || view === View.ADMIN) && (
          <SuperbowlGame
            isAdmin={view === View.ADMIN}
            gameCard={gameCard}
            setGameCard={setGameCard}
            currentPick={currentPick}
          />
        )}
        {view === View.STANDINGS && (
          <SuperbowlStandings leaderboard={leaderboard} currentPick={currentPick} />
        )}
      </div>
      <SuperbowlFooter numPicks={numPicks} handlePayToken={handlePayToken} />
    </div>
  );
};

export default Superbowl;
