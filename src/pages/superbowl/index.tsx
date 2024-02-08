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
import { toast } from "sonner";

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
  const [gameCard, setGameCard] = useState<SuperbowlGameCard | null>(null);
  const [currentPick, setCurrentPick] = useState<Pickem | null>(null);
  const [leaderboard, setLeaderboard] = useState<SuperbowlLeaderboard | null>(
    null
  );
  const [celebrateSubmit, setCelebrateSubmit] = useState(false);

  const {
    data: pickemData,
    isLoading: pickemLoading,
    refetch: reloadUserPicks,
  } = useQuery({
    queryKey: ["pickems"],
    queryFn: getPickems,
  });

  const loadLeaderboard = async (pick: Pickem) => {
    try {
      const headers = new Headers();
      headers.append("Content-Type", "application/json");

      const requestOptions = {
        method: "GET",
        headers: headers,
      };

      const response = await fetch(
        `${generalConfig.apiUrl}/api/leaderboard_pickem?pickId=${pick._id}`,
        requestOptions
      );
      const body = await response.json();

      if (response.status === 200 && body.data.length >= 1) {
        const leaderboard = body.data;

        if (pick.status === "live") {
          setLeaderboard(leaderboard.reverse());
        } else {
          setLeaderboard(leaderboard);
        }
      }
    } catch (err) {
      console.log(`Error loading leaderboard for pick ${pick._id} ${err}`);
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
        return false;
      }
    } catch (err) {
      console.log(`Error placing bet ${err}`);
      return false;
    }
  };

  // For popup
  useEffect(() => {
    if (!pickemData || pickemData.length === 0) return;

    const currPick = pickemData[pickemData.length - 1];
    console.log(`Found this pickem:`, currPick);

    // Load leaderboard for pick
    loadLeaderboard(currPick);

    // Convert to gameCard
    const gameCard = convertToGameCard(currPick, false);

    setCurrentPick(currPick);
    setGameCard(gameCard);
  }, [pickemData]);

  useEffect(() => {
    async function handleViewChange() {
      if (!currentPick) return;

      console.log("view is changing to ", view, currentPick);
      // Kind of janky right now... but only for admins
      if (view === View.ADMIN) {
        const gameCard = convertToGameCard(currentPick, true);
        setGameCard(gameCard);
      } else if (view === View.STANDINGS) {
        // Reload leaderboard on view switch
        const newPickems = await getPickems();
        if (newPickems !== null) {
          setCurrentPick(newPickems[newPickems.length - 1]);
          loadLeaderboard(newPickems[newPickems.length - 1]);
        } else {
          loadLeaderboard(currentPick);
        }
      }
    }

    handleViewChange();
  }, [view]);  

  const handlePayToken = async () => {
    if (!currentPick) return "No picks found";
    if (!gameCard) return "No game card found";

    const cardFilled = Object.keys(gameCard).every((key) => {
      const card = gameCard[key as keyof SuperbowlGameCard];
      return (
        card.answer !== null && card.answer !== undefined && card.answer !== ""
      );
    });

    if (!cardFilled) {
      return "Please fill out all fields";
    }

    console.log("Submitting pickem entry...", gameCard, currentPick);

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
      setView(View.STANDINGS);
      return "Picks submitted!";
    } else {
      return "Something went wrong, please try again later.";
    }
  };

  const onClick = async () => {
    toast.promise(handlePayToken(), {
      loading: "Submitting picks...",
      success: (data) => data,
      error: (error) => {
        console.log("error", `${error?.message}`);
        return error.message;
      },
    });
    setCelebrateSubmit(true);
  };

  useEffect(() => {
    if (celebrateSubmit) {
      const timer = setTimeout(() => {
        setCelebrateSubmit(false);
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [celebrateSubmit]);

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
          <SuperbowlStandings
            leaderboard={leaderboard}
            currentPick={currentPick}
            celebrateSubmit={celebrateSubmit}
          />
        )}
      </div>
      <SuperbowlFooter
        gameCard={gameCard}
        startDate={currentPick?.startDate}
        endDate={currentPick?.endDate}
        handlePayToken={onClick}
      />
    </div>
  );
};

export default Superbowl;
