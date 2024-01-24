import Image from "next/image";
import { FC } from "react";

interface Props {}

const SuperbowlLeaderboardItem: FC = () => {
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
        <p className="text-white">User</p>
      </p>
      <p className="w-20 text-white">9 of 10</p>
    </div>
  );
};

export default SuperbowlLeaderboardItem;
