import { GameInfo } from "@/types";
import Image from "next/image";
import { FC, useEffect, useState } from "react";

interface Props {
  gameData: any;
  loadGameData: () => Promise<GameInfo | null | undefined>;
}

const ManageGame: FC<Props> = ({ gameData, loadGameData }) => {
  const [selectedTeam, setSelectedTeam] = useState<string | undefined>();
  const [isAirdropped, setIsAirdropped] = useState<boolean>(false);
  const [isRefunded, setIsRefunded] = useState<boolean>(false);

  // TODO: import final selected winner and setSelectedTeam in useEffect
  // then, if airdrops occurred, set that team's border/bg color to green

  useEffect(() => {
    // Ensures gameData state is up-to-date
    async function load() {
      await loadGameData();
    }

    load();
  }, []);

  useEffect(() => {
    if (isRefunded) {
      setSelectedTeam(undefined);
    }
  }, [isRefunded]);

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
              selectedTeam === gameData.team1.teamName
                ? "border-link bg-[#7808FF1A]/10"
                : "border-transparent bg-white"
            } flex items-center gap-5 px-5 cursor-pointer sm:hover:scale-[1.02]
            transition-transform ease-in-out duration-500`}
            onClick={() => {
              if (selectedTeam === gameData.team1.teamName) {
                setSelectedTeam(undefined);
              } else {
                setSelectedTeam(gameData.team1.teamName);
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
              selectedTeam === gameData.team2.teamName
                ? "border-link bg-[#7808FF1A]/10"
                : "border-transparent bg-white"
            } flex items-center gap-5 px-5 cursor-pointer sm:hover:scale-[1.02]
            transition-transform ease-in-out duration-500`}
            onClick={() => {
              if (selectedTeam === gameData.team2.teamName) {
                setSelectedTeam(undefined);
              } else {
                setSelectedTeam(gameData.team2.teamName);
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
          <div
            className={`mt-5 w-[90%] sm:w-[400px] h-[50px] px-5 cursor-pointer bg-black
            hover:scale-[1.02] transition-transform ease-in-out duration-500 flex items-center justify-center`}
            // onClick={}
          >
            <p className="font-base-b text-white">Airdrop winners</p>
          </div>
        )}

        {isRefunded ? (
          <p
            className="font-base-b text-incorrect text-center h-[50px] 
            flex items-center justify-center"
          >
            Picks refunded.
          </p>
        ) : (
          <p
            className="font-base-b text-incorrect text-center h-[50px] 
            flex items-center justify-center cursor-pointer z-50"
            // onClick={}
          >
            Cancel game
          </p>
        )}
      </div>
    </div>
  );
};

export default ManageGame;
