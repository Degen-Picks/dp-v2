import { SuperbowlLeaderboardEntry } from "@/types/Superbowl";
import { getProfileImageFromDeID, getUsernameFromDeID } from "@/utils";
import Image from "next/image";
import { FC } from "react";

interface Props {
  rank: number;
  entry: SuperbowlLeaderboardEntry;
  setSelectedEntry: (entry: SuperbowlLeaderboardEntry | null) => void;
  setShowModal: (showModal: boolean) => void;
  numPicksSet: number;
}

const SuperbowlLeaderboardItem: FC<Props> = ({
  rank,
  entry,
  setSelectedEntry,
  setShowModal,
  numPicksSet,
}) => {
  return (
    <div
      className={`w-full h-[60px] rounded-[10px] bg-greyscale5 px-2.5 py-[15px] cursor-pointer
      border border-transparent hover:border-data hover:bg-[#282622] flex items-center gap-2.5`}
      onClick={() => {
        setSelectedEntry(entry);
        setShowModal(true);
      }}
    >
      <p className="text-[#808080] text-center w-10">{rank}</p>
      <div className="w-full flex items-center gap-2.5">
        <Image
          src={getProfileImageFromDeID(entry.wagerUserDetails?.deidData!)}
          width={40}
          height={40}
          alt="user icon"
          className="rounded-full"
        />
        <p className="text-white">
          {getUsernameFromDeID(
            entry.wagerUserDetails?.deidData!,
            entry.publicKey
          )}
        </p>
      </div>
      <p className="text-center w-20 text-[#808080]">
        {entry.points} of {numPicksSet}
      </p>
    </div>
  );
};

export default SuperbowlLeaderboardItem;
