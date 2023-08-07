import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { airdropClassic, handleConfirmAction, refundClassic } from "@/utils";
import toast from "react-hot-toast";
import { GameInfo, Team } from "../../types";
import { useWallet } from "@solana/wallet-adapter-react";
import { GameStatus } from "./ClassicView";
import { ClassicHero } from "@/components";

interface Props {
  gameData: GameInfo;
  gameStatus: GameStatus;
  loadGameData: () => Promise<GameInfo | undefined | null>;
}

const ManageGame: FC<Props> = ({ gameData, gameStatus, loadGameData }) => {
  const [selectedTeam, setSelectedTeam] = useState<Team | undefined>(undefined);
  const [isAirdropped, setIsAirdropped] = useState<boolean>(false);
  const [isRefunded, setIsRefunded] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const wallet = useWallet();

  const isDisabled =
    gameData.gameInfo.status !== "closed" ||
    loading ||
    isRefunded ||
    isAirdropped;

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
    const confirmation = await handleConfirmAction(
      wallet,
      "Are you sure you want to cancel this game?"
    );
    if (!confirmation) return;

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

    const confirmation = await handleConfirmAction(
      wallet,
      `Are you sure you want to declare ${selectedTeam.teamName} as the winner?`
    );
    if (!confirmation) return;

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

  const getStyles = (team: 1 | 2) => {
    if (isAirdropped) {
      if (selectedTeam?.teamName === gameData.team1.teamName && team === 1) {
        return "border-correct bg-[#E8F5E9]";
      } else if (
        selectedTeam?.teamName === gameData.team2.teamName &&
        team === 2
      ) {
        return "border-correct bg-[#E8F5E9]";
      } else {
        return "border-transparent bg-white";
      }
    } else if (isRefunded) {
      return "border-transparent bg-white";
    } else {
      if (selectedTeam?.teamName === gameData.team1.teamName && team === 1) {
        return "border-link bg-[#7808FF1A]/10";
      } else if (
        selectedTeam?.teamName === gameData.team2.teamName &&
        team === 2
      ) {
        return "border-link bg-[#7808FF1A]/10";
      } else {
        return "border-transparent bg-white";
      }
    }
  };

  return (
    <div className="w-full">
      <ClassicHero gameData={gameData} gameStatus={gameStatus} />
      <div className="w-full flex flex-col items-center justify-center gap-5">
        <div className="w-full relative">
          <button
            className={`${
              (isRefunded || isAirdropped) && "opacity-70 cursor-not-allowed"
            } w-[90%] mx-auto sm:w-[400px] h-[50px] border-2
            flex items-center gap-5 px-5 cursor-pointer sm:hover:scale-[1.02]
            transition-transform ease-in-out duration-500 disabled:sm:hover:scale-[1.0]
            disabled:cursor-default ${getStyles(1)}`}
            disabled={isDisabled}
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
          </button>
          <p className="hidden sm:block absolute top-1/2 -translate-y-1/2 -left-20 text-secondary">
            Team 1
          </p>
        </div>
        <div className="w-full relative">
          <button
            className={`${
              (isRefunded || isAirdropped) && "opacity-70 cursor-not-allowed"
            } w-[90%] mx-auto sm:w-[400px] h-[50px] border-2
            flex items-center gap-5 px-5 cursor-pointer sm:hover:scale-[1.02]
            transition-transform ease-in-out duration-500 disabled:sm:hover:scale-[1.0]
            disabled:cursor-default ${getStyles(2)}`}
            disabled={isDisabled}
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
          </button>
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
            hover:scale-[1.02] transition-transform ease-in-out duration-500 flex 
            items-center justify-center disabled:cursor-not-allowed disabled:hover:scale-100 disabled:opacity-70`}
            onClick={handleAirDrop}
            disabled={isDisabled}
          >
            <p className="font-base-b text-white">Airdrop winners</p>
          </button>
        )}

        {isRefunded ? (
          <p
            className="font-base-b text-incorrect text-center
              flex items-center justify-center"
          >
            Game refunded successfully.
          </p>
        ) : (
          <button
            className={`${
              isAirdropped && "hidden"
            } font-base-b text-incorrect text-center h-[50px] 
            flex items-center justify-center cursor-pointer z-50`}
            onClick={handleCancelGame}
            disabled={isRefunded || isAirdropped}
          >
            Cancel game
          </button>
        )}
      </div>
    </div>
  );
};

export default ManageGame;
