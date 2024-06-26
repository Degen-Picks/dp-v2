import { FC } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { ActivityFeedItem } from "@/types/ActivityFeed";

interface Props {
  data: ActivityFeedItem[];
}

const ActivityDrawerData: FC<Props> = ({ data }) => {
  const wallet = useWallet();

  return (
    <>
      {/* <div className="flex flex-col gap-2 justify-center">
        <p className="text-greyscale1 text-[18px] font-base-b pr-10">
          {data.title}
        </p>
        {data.description && (
          <p className="text-greyscale4 text-xs">{data.description}</p>
        )}
      </div>
      <div
        className={`w-full flex gap-0.5 h-[70px] ${
          !wallet.publicKey ? "text-greyscale1/50" : "text-greyscale1"
        }`}
      >
        {data.selections?.map((o, index) => (
          <button
            key={o._id}
            disabled={!wallet.publicKey}
            className={`p-2.5 w-full h-full rounded-[20px] disabled:cursor-not-allowed ${
              index < 1 && "rounded-r-none"
            } ${index > 0 && "rounded-l-none"} ${
              data.selections?.find((o) => o.winner)?._id === o._id
                ? "bg-[#282622] border border-data"
                : "bg-greyscale5 hover:bg-greyscale1/10 disabled:hover:bg-greyscale5"
            }`}
            // onClick={() => handleSelect(o._id)}
          >
            {o.title}
          </button>
        ))}
      </div> */}
    </>
  );
};

export default ActivityDrawerData;
