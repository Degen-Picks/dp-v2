import { FC, useContext, useEffect, useState } from "react";
import { handleConfirmAction, refundClassic } from "@/utils";
import toast from "react-hot-toast";
import { GameInfo, Team } from "../../types";
import { useWallet } from "@solana/wallet-adapter-react";
import { GameStatus } from "./ClassicView";
import {
  ClassicHero,
  ClassicVersusBox,
  Divider,
  InfoModal,
  ManageStats,
} from "@/components";
import { airdropClassic } from "@/utils/api/classic/airdrop";
import {
  WagerUserContext,
  WagerUserContextType,
} from "../stores/WagerUserStore";
import { generalConfig } from "@/configs";

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
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const wallet = useWallet();
  const { wagerUser } = useContext(WagerUserContext) as WagerUserContextType;

  const isDisabled =
    gameStatus !== GameStatus.CLOSED ||
    loading ||
    isRefunded ||
    isAirdropped ||
    selectedTeam === undefined;

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
    if (wagerUser?.roles?.includes("ADMIN")) {
      const confirmation = await handleConfirmAction(
        wallet,
        "Are you sure you want to cancel this game?"
      );
      if (!confirmation) return;

      const toastId = toast.loading("Cancelling game...");
      setLoading(true);

      const { success, message } = await refundClassic(gameData);

      success === true
        ? toast.success("Game cancelled!")
        : toast.error(message);

      // Refresh game data
      await loadGameData();

      setIsRefunded(success);

      toast.dismiss(toastId);
      setLoading(false);
    } else {
      setShowCancelModal(true);
    }
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
      if (selectedTeam?.teamName === gameData.team1.teamName) {
        setSelectedTeam(undefined);
        return;
      } else {
        setSelectedTeam(gameData.team1);
      }
    } else {
      if (selectedTeam?.teamName === gameData.team2.teamName) {
        setSelectedTeam(undefined);
        return;
      } else {
        setSelectedTeam(gameData.team2);
      }
    }
  };

  return (
    <>
      <div className="w-full max-w-[620px] mx-auto px-4 sm:px-0">
        <div className="mb-[72px]">
          <ClassicHero gameData={gameData} gameStatus={gameStatus} />
        </div>
        <div className="w-full flex flex-col gap-5 items-center justify-center">
          {/* manage stats */}
          <ManageStats
            gameData={gameData}
            showModal={showInfoModal}
            setShowModal={setShowInfoModal}
          />
          <div className="bg-greyscale1 w-full md:w-[620px] mx-auto mb-20">
            <div className="flex flex-col justify-evenly items-center py-3 mx-5 md:mx-[60px]">
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
                <p className="text-correct h-[50px] flex items-center justify-center">
                  Winners airdropped!
                </p>
              ) : (
                <button
                  className={`${
                    isRefunded && "hidden"
                  } mt-5 w-full h-[50px] px-5 cursor-pointer bg-black
                flex items-center justify-center disabled:cursor-not-allowed 
                disabled:bg-disabled hover:bg-[#333333]`}
                  onClick={handleAirDrop}
                  disabled={isDisabled}
                >
                  <p className="text-greyscale1">Airdrop winners</p>
                </button>
              )}

              {isRefunded ? (
                <p
                  className="text-incorrect text-center
                flex items-center justify-center"
                >
                  Game refunded successfully.
                </p>
              ) : (
                <button
                  className={`${
                    isAirdropped && "hidden"
                  } text-incorrect hover:text-[#A91A23] text-center h-[50px] 
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
      <InfoModal showModal={showCancelModal} setShowModal={setShowCancelModal}>
        <div
          className="w-full pt-4 text-center gap-5
          flex flex-col items-center justify-center"
        >
          <p className="text-xl sm:text-2xl font-base-b text-center">
            Cancelling games
          </p>
          <p className="max-w-[400px] mx-auto text-base sm:text-lg">
            If there’s an issue with your game, reach out to an admin or{" "}
            <a
              href={generalConfig.discordUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="underline text-purple1 hover:text-purple2"
            >
              open a ticket
            </a>{" "}
            in Discord.
          </p>
          <button
            className="ml-auto text-purple1 hover:text-purple2 text-lg"
            onClick={() => setShowCancelModal(false)}
          >
            Close
          </button>
        </div>
      </InfoModal>
    </>
  );
};

export default ManageGame;
