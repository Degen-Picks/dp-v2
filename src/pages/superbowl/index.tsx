import { FC, useEffect, useState } from "react";
import Navbar from "@/components/organisms/Navbar";
import SuperbowlRules from "@/components/organisms/SuperbowlRules";
import SuperbowlGame from "@/components/organisms/SuperbowlGame";
import SuperbowlStandings from "@/components/organisms/SuperbowlStandings";
import { useWallet } from "@solana/wallet-adapter-react";
import { generalConfig } from "@/configs";
import { Pickem } from "@/types";
import { SuperbowlGameCard, SuperbowlLeaderboard } from "@/types/Superbowl";
import { getPickems } from "@/utils";
import SuperbowlFooter from "@/components/organisms/SuperbowlFooter";

export enum View {
  RULES = "Rules",
  GAME = "Game",
  STANDINGS = "Standings",
  ADMIN = "Admin",
}

const Superbowl: FC = () => {
  const { publicKey } = useWallet();

  const [view, setView] = useState<View>(View.RULES);
  const [numPicks, setNumPicks] = useState<number>(0);

  const [gameCard, setGameCard] = useState<SuperbowlGameCard | null>(null);
  const [currentPick, setCurrentPick] = useState<Pickem | null>(null);
  const [placedPicks, setPlacedPicks] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<SuperbowlLeaderboard | null>(null); 

   // For popup
  useEffect(() => {
    const loadPickems = async () => {
      const pickems = await getPickems();
      if (pickems === null) return;
      if (pickems.length === 0) return;

      const currPick = pickems[pickems.length - 1];
      console.log(`Found ya pickem:`, currPick);

      // Load leaderboard for pick
      loadLeaderboard(currPick);
     
      // Convert to gameCard
      const gameCard = convertToGameCard(currPick, false);

      setCurrentPick(currPick);     
      setGameCard(gameCard);
    };

    loadPickems();
  }, []);

  useEffect(() => {
    if(!currentPick) return;

    // Kind of janky right now... but only for admins 
    if(view === View.ADMIN) {
      const gameCard = convertToGameCard(currentPick, true);
      setGameCard(gameCard);
    } else if(view === View.STANDINGS) { // Reload leaderboard on view switch
      loadLeaderboard(currentPick);
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
        setLeaderboard(leaderboard);
      }
    } catch (err) {
      console.log(`Error loading leaderboard for pick ${pick._id} ${err}`);
    }
  }

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

  return (
    <div className="w-screen min-h-screen flex flex-col bg-greyscale6">
      <Navbar view={view} setView={setView} />
      <div className="w-full max-w-[620px] mx-auto flex flex-col flex-1 items-center">
        {view === View.RULES && <SuperbowlRules />}
        {view === View.STANDINGS && <SuperbowlStandings leaderboard={leaderboard}/>}
        
        {(view === View.GAME || view === View.ADMIN)
          && <SuperbowlGame 
                isAdmin={view === View.ADMIN} 
                gameCard={gameCard}
                setGameCard={setGameCard}
                currentPick={currentPick}
                placedPicks={placedPicks}
                loadUserPicks={loadUserPicks} />}
      </div>
      {view === View.GAME && <SuperbowlFooter numPicks={numPicks} />}
    </div>
  );
};

export default Superbowl;
