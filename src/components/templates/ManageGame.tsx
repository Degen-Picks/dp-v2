import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { airdropClassic, refundClassic } from "@/utils";
import toast from "react-hot-toast";
import { GameInfo, Team } from "../../types";

interface Props {
  gameData: GameInfo;
  loadGameData: () => Promise<GameInfo | undefined | null>;
}

const ManageGame: FC<Props> = ({ gameData, loadGameData }) => {
  const [selectedTeam, setSelectedTeam] = useState<Team | undefined>(undefined);
  const [isAirdropped, setIsAirdropped] = useState<boolean>(false);
  const [isRefunded, setIsRefunded] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  // TODO: import final selected winner and setSelectedTeam in useEffect
  // then, if airdrops occurred, set that team's border/bg color to green and disable select

  useEffect(() => {
    // Ensures gameData state is up-to-date
    async function load() {
      await loadGameData();
    }

    load();
  }, []);

  useEffect(() => {
    if (gameData.gameInfo.status === "cancelled") {
      setIsRefunded(true);
      return;
    }

    if (gameData.gameInfo.status === "completed") {
      gameData.team1.winner === true
        ? setSelectedTeam(gameData.team1)
        : setSelectedTeam(gameData.team2);

      setIsAirdropped(true);
      return;
    }
  }, [gameData]);

  useEffect(() => {
    if (isRefunded) {
      setSelectedTeam(undefined);
    }
  }, [isRefunded]);

  const handleCancelGame = async () => {
    const toastId = toast.loading("Cancelling game...");
    setLoading(true);

    const { success, message } = await refundClassic(gameData);

    success === true ? toast.success("Game cancelled!") : toast.error(message);

    // Refresh game data
    await loadGameData();

    setIsRefunded(success);

    toast.dismiss(toastId);
    setLoading(false);
  };

  const handleAirDrop = async () => {
    if (selectedTeam === undefined) {
      toast.error("Please select a winner first!");
      return;
    }

    if (gameData.gameInfo.status !== "closed") {
      toast.error("Game must be closed to airdrop winners!");
      return;
    }

    const toastId = toast.loading("Declaring winner...");
    setLoading(true);

    const { success, message } = await airdropClassic(gameData, selectedTeam);

    success === true
      ? toast.success("Winner declared and initiated airdrop!")
      : toast.error(message);

    // Refresh game data
    await loadGameData();

    setIsAirdropped(success);

    toast.dismiss(toastId);
    setLoading(false);
  };

  return (
    <div className="w-full">
      <div className="my-10 pb-10 lg:pb-0">
        <div className="w-fit mx-auto lg:mb-0">
          <div className=" font-pressura text-center">
            {gameData.gameInfo.title}
          </div>
          <div className="font-bingodilan text-center text-3xl text-black">
            Manage Game
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col items-center justify-center gap-5">
        <div className="w-full relative">
          <div
            className={`w-[90%] mx-auto sm:w-[400px] h-[50px] border-2 ${
              selectedTeam?.teamName === gameData.team1.teamName
                ? "border-link bg-[#7808FF1A]/10"
                : "border-transparent bg-white"
            } flex items-center gap-5 px-5 cursor-pointer sm:hover:scale-[1.02]
            transition-transform ease-in-out duration-500`}
            onClick={() => {
              if (selectedTeam?.teamName === gameData.team1.teamName) {
                setSelectedTeam(undefined);
              } else {
                setSelectedTeam(gameData.team1);
              }
            }}
          >
            <Image
              src={gameData.team1.teamLogo}
              width={30}
              height={30}
              alt={gameData.team1.teamName}
            />
            <p className="font-base-b">{gameData.team1.teamName}</p>
          </div>
          <p className="hidden sm:block absolute top-1/2 -translate-y-1/2 -left-20 text-secondary">
            Team 1
          </p>
        </div>
        <div className="w-full relative">
          <div
            className={`w-[90%] mx-auto sm:w-[400px] h-[50px] border-2 ${
              selectedTeam?.teamName === gameData.team2.teamName
                ? "border-link bg-[#7808FF1A]/10"
                : "border-transparent bg-white"
            } flex items-center gap-5 px-5 cursor-pointer sm:hover:scale-[1.02]
            transition-transform ease-in-out duration-500`}
            onClick={() => {
              if (selectedTeam?.teamName === gameData.team2.teamName) {
                setSelectedTeam(undefined);
              } else {
                setSelectedTeam(gameData.team2);
              }
            }}
          >
            <Image
              src={gameData.team2.teamLogo}
              width={30}
              height={30}
              alt={gameData.team2.teamName}
            />
            <p className="font-base-b text-black">{gameData.team2.teamName}</p>
          </div>
          <p className="hidden sm:block absolute top-1/2 -translate-y-1/2 -left-20 text-secondary">
            Team 2
          </p>
        </div>
        {isAirdropped ? (
          <p className="text-correct font-base-b h-[50px] flex items-center justify-center">
            Winners airdropped!
          </p>
        ) : (
          <button
            className={`${
              isRefunded && "hidden"
            } mt-5 w-[90%] sm:w-[400px] h-[50px] px-5 cursor-pointer bg-black
            hover:scale-[1.02] transition-transform ease-in-out duration-500 flex items-center justify-center`}
            onClick={handleAirDrop}
            disabled={isRefunded || isAirdropped || loading}
          >
            <p className="font-base-b text-white">Airdrop winners</p>
          </button>
        )}

        {isRefunded ? (
          <p
            className="font-base-b text-incorrect text-center h-[50px] 
            flex items-center justify-center"
          >
            Picks refunded.
          </p>
        ) : (
          <button
            className={`${
              isAirdropped && "hidden"
            } font-base-b text-incorrect text-center h-[50px] 
            flex items-center justify-center cursor-pointer z-50`}
            onClick={handleCancelGame}
            disabled={isRefunded || isAirdropped || loading}
          >
            Cancel game
          </button>
        )}
      </div>
    </div>
  );
};

export default ManageGame;
