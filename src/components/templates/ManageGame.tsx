import { FC, useEffect, useState } from "react";
import { handleConfirmAction, pickFee, refundClassic } from "@/utils";
import toast from "react-hot-toast";
import { GameInfo, Team } from "../../types";
import { useWallet } from "@solana/wallet-adapter-react";
import { GameStatus } from "./ClassicView";
import {
  ClassicHero,
  ClassicVersusBox,
  Divider,
  TwitterShare,
} from "@/components";
import { airdropClassic } from "@/utils/api/classic/airdrop";

interface Props {
  gameData: GameInfo;
  gameStatus: GameStatus;
  loadGameData: () => Promise<GameInfo | undefined | null>;
}

const ManageGame: FC<Props> = ({ gameData, loadGameData, gameStatus }) => {
  const [selectedTeam, setSelectedTeam] = useState<Team | undefined>(undefined);
  const [isAirdropped, setIsAirdropped] = useState<boolean>(false);
  const [isRefunded, setIsRefunded] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const wallet = useWallet();

  const isDisabled =
    gameStatus !== GameStatus.CLOSED || loading || isRefunded || isAirdropped;

  useEffect(() => {
    // Ensures gameData state is up-to-date
    async function load() {
      await loadGameData();
    }

    load();
  }, []);

  useEffect(() => {
    if (gameStatus === GameStatus.CANCELLED) {
      setIsRefunded(true);
      return;
    }

    if (gameStatus === GameStatus.AIRDROPPED) {
      gameData.team1.winner === true
        ? setSelectedTeam(gameData.team1)
        : setSelectedTeam(gameData.team2);

      setIsAirdropped(true);
      return;
    }
  }, [gameData, gameStatus]);

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

  const handleCreatorFee = () => {
    let creatorFee: number;
    const totalVolume = gameData.team1.dustVol + gameData.team2.dustVol;
    if (gameData.gameInfo.creator?.roles?.includes("ADMIN")) {
      creatorFee = totalVolume * pickFee;
    } else {
      creatorFee = (totalVolume * pickFee) / 2;
    }

    return creatorFee.toFixed(2);
  };

  const handleAirDrop = async () => {
    if (selectedTeam === undefined) {
      toast.error("Please select a winner first!");
      return;
    }

    if (gameStatus !== GameStatus.CLOSED) {
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

  const pickHandler = (teamNum: number) => {
    if (teamNum === 1) {
      setSelectedTeam(gameData.team1);
    } else {
      setSelectedTeam(gameData.team2);
    }
  };

  return (
    <div className="w-full max-w-[620px] mx-auto px-4 sm:px-0">
      <div className="mt-16 mb-[72px]">
        <ClassicHero gameData={gameData} gameStatus={gameStatus} />
      </div>
      <div className="w-full flex flex-col items-center justify-center">
        <div className="relative bg-greyscale1 w-5/6 h-[121px] md:w-[620px] mx-auto flex items-center">
          <div className="absolute right-0 -top-12">
            <TwitterShare
              url={`https://app.degenpicks.xyz/${gameData.gameInfo.id}`}
            />
          </div>
          <div className="w-full flex justify-between items-center py-3 mx-8 md:mx-[60px]">
            <div className="h-[81px] px-10 flex flex-col items-center justify-center">
              <p className="leading-none sm:text-lg">
                {gameData.team1.uniqueWallets + gameData.team2.uniqueWallets}
              </p>
              <p className="text-center text-greyscale4">players</p>
            </div>
            <div className="h-[81px] px-10 flex flex-col items-center justify-center">
              <p className="leading-none sm:text-lg">
                {(gameData.team1.dustVol + gameData.team2.dustVol).toFixed(2)}
              </p>
              <p className="text-center text-greyscale4">volume</p>
            </div>
            <div className="h-[81px] px-10 bg-greyscale2 flex flex-col items-center justify-center">
              <p className="leading-none sm:text-lg">{handleCreatorFee()}</p>
              <p className="text-center text-greyscale4">you get</p>
            </div>
          </div>
        </div>
        <div className="pb-8" />
        <div className="bg-greyscale1 w-5/6 md:w-[620px] mx-auto mb-20">
          <div className="flex flex-col justify-evenly items-center py-3 mx-8 md:mx-[60px]">
            <p className="text-left mr-auto pt-4 pb-2 sm:text-lg">
              Set the game winner
            </p>
            <ClassicVersusBox
              gameData={gameData}
              success={isAirdropped || isRefunded}
              handlePicks={pickHandler}
              pickedTeams={[selectedTeam?.teamName]}
              valid={gameStatus === GameStatus.CLOSED}
              gameStatus={gameStatus}
              hideImage={gameData.gameInfo.league === "custom"}
            />
            {/* divider */}
            <Divider />
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
                <p className="font-base-b text-greyscale1">Airdrop winners</p>
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
      </div>
    </div>
  );
};

export default ManageGame;
