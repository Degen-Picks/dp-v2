import Image from "next/image";
import { FC } from "react";

const BuyDustButton: FC = () => {
  return (
    <button
      className="h-[50px] w-[160px] py-2.5 flex items-center justify-center gap-2.5
      rounded-[20px] border border-[#404040] hover:border-greyscale1"
      onClick={() =>
        window.open(
          "https://jup.ag/swap/SOL-DUST",
          "_blank",
          "noopener noreferrer"
        )
      }
    >
      <p className="text-greyscale1 font-figtree whitespace-nowrap text-base">
        Buy DUST
      </p>
      <Image
        src="/images/icons/jupiter.png"
        width={30}
        height={30}
        alt="jupiter logo"
        className="-mr-1"
      />
    </button>
  );
};

export default BuyDustButton;
