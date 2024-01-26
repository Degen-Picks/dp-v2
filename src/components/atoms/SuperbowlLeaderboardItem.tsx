import Image from "next/image";
import { FC } from "react";

interface Props {
  publicKey: string;
  points: number;
  numSelections: number;
}

const SuperbowlLeaderboardItem: FC<Props> = ({ publicKey, points, numSelections }) => {
  return (
    <div className="w-full h-[60px] rounded-[10px] bg-greyscale1/5 px-[30px] py-[15px] flex items-center">
      <p className="text-white w-10">1</p>
      <p className="w-full flex items-center gap-2.5">
        <Image
          src="/images/icons/user-alt.png"
          width={40}
          height={40}
          alt="user icon"
          className="rounded-full overflow-hidden"
        />
        <p className="text-white">{publicKey}</p>
      </p>
      <p className="w-20 text-white">{points} of {numSelections}</p>
    </div>
  );
};

export default SuperbowlLeaderboardItem;
