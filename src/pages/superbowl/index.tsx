import { FC, useEffect, useState } from "react";
import Navbar from "@/components/organisms/Navbar";
import SuperbowlRules from "@/components/organisms/SuperbowlRules";
import SuperbowlGame from "@/components/organisms/SuperbowlGame";
import SuperbowlStandings from "@/components/organisms/SuperbowlStandings";
import { useWallet } from "@solana/wallet-adapter-react";
import { generalConfig } from "@/configs";
import { Pickem } from "@/types";
import { SuperbowlGameCard } from "@/types/Superbowl";
import { getPickems } from "@/utils";

export enum View {
  RULES = "Rules",
  GAME = "Game",
  STANDINGS = "Standings",
  ADMIN = "Admin",
}

const Superbowl: FC = () => {
  const { publicKey } = useWallet();

  const [view, setView] = useState<View>(View.RULES);

  const [gameCard, setGameCard] = useState<SuperbowlGameCard | null>(null);
  const [currentPick, setCurrentPick] = useState<Pickem | null>(null);
  const [placedPicks, setPlacedPicks] = useState<any[]>([]);

   // For popup
  useEffect(() => {
    const loadPickems = async () => {
      const pickems = await getPickems();
      if (pickems === null) return;
      if (pickems.length === 0) return;

      const currPick = pickems[pickems.length - 1];
      console.log(`Found ya pickem:`, currPick);
     
      // Convert to gameCard
      const gameCard = convertToGameCard(currPick, false);

      setCurrentPick(currPick);     
      setGameCard(gameCard);
    };

    loadPickems();
  }, []);

  // TODO: Might want to reload picks here?
  useEffect(() => {
    if(view === View.ADMIN && currentPick) {
      const gameCard = convertToGameCard(currentPick, true);
      setGameCard(gameCard);
    }
  }, [view]);

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
  };

  const convertToGameCard = (data: Pickem, isAdmin: boolean) => {
    const gameCard: SuperbowlGameCard = {};

    data.selections.forEach((selection) => {
      const gameCardKey = selection.name;

      // If admin, show already selected options
      let answer = null;
      if (isAdmin) {
        for (const team of selection.teams) {
          if (team.winner) {
            answer = team._id;
          }
        }
      }

      // TODO: will need to change if we do 3+ options
      gameCard[gameCardKey] = {
        title: selection.title,
        answer,
        option1: {
          title: selection.teams[0]?.name,
          _id: selection.teams[0]?._id,
        },
        option2: {
          title: selection.teams[1]?.name,
          _id: selection.teams[1]?._id,
        },
      };

      if (gameCardKey === "tiebreaker") {
        gameCard[gameCardKey] = {
          title: selection.title,
          answer: "",
        };
      }
    });

    return gameCard;
  };

  return (
    <div className="w-screen min-h-screen flex flex-col bg-superbowlBg">
      <Navbar view={view} setView={setView} />
      <div className="w-full max-w-[620px] mx-auto flex flex-col flex-1 items-center">
        {view === View.RULES && <SuperbowlRules />}
        {view === View.STANDINGS && <SuperbowlStandings currentPick={currentPick}/>}
        
        {(view === View.GAME || view === View.ADMIN)
          && <SuperbowlGame 
                isAdmin={view === View.ADMIN} 
                gameCard={gameCard}
                setGameCard={setGameCard}
                currentPick={currentPick}
                placedPicks={placedPicks}
                loadUserPicks={loadUserPicks} />}
      </div>
    </div>
  );
};

export default Superbowl;
