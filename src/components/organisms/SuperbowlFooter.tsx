import { FC, useEffect, useState } from "react";
import BuyDustButton from "../atoms/BuyDustButton";
import SuperbowlButton from "../atoms/SuperbowlButton";
import { SuperbowlGameCard } from "@/types/Superbowl";
import { useWallet } from "@solana/wallet-adapter-react";
import Twitter from "../@icons/Twitter";
import Discord from "../@icons/Discord";

interface Props {
  gameCard: SuperbowlGameCard | null;
  startDate: number | undefined;
  endDate: number | undefined;
  handlePayToken: () => void;
}

const SuperbowlFooter: FC<Props> = ({
  gameCard,
  startDate,
  endDate,
  handlePayToken,
}) => {
  const { publicKey } = useWallet();

  const [buttonText, setButtonText] = useState<string>("One sec...");

  const disabled =
    !publicKey ||
    !startDate ||
    !endDate ||
    Date.now() > endDate ||
    buttonText !== "Submit";

  useEffect(() => {
    const updateButtonText = (timer: number) => {
      if (gameCard) {
        const numPicks = Object.keys(gameCard).reduce((acc, key) => {
          const card = gameCard[key as keyof SuperbowlGameCard];
          if (
            card.answer !== null &&
            card.answer !== undefined &&
            card.answer !== ""
          ) {
            acc.push(card.answer);
          }
          return acc;
        }, [] as string[]).length;
        if (numPicks === 0 && endDate) {
          const now = new Date().getTime();
          const distance = endDate - now;

          if (distance > 0) {
            // calculate time left
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor(
              (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const minutes = Math.floor(
              (distance % (1000 * 60 * 60)) / (1000 * 60)
            );

            // Update the button text
            setButtonText(`${days}d ${hours}h ${minutes}m`);
          } else {
            setButtonText("Game is live");
            clearInterval(timer);
          }
        } else if (numPicks < Object.keys(gameCard).length) {
          setButtonText(
            `${Object.keys(gameCard).length - numPicks} picks left`
          );
        } else {
          setButtonText("Submit");
        }
      }
    };

    const timer = setInterval(updateButtonText, 1000); // update every second
    // call once immediately and set an interval for updates
    updateButtonText(timer);
    // cleanup interval on component unmount
    return () => clearInterval(timer);
  }, [gameCard, endDate]);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 h-20 flex items-center px-2 md:px-0
      justify-between bg-greyscale6 text-greyscale1 border-t border-[#404040]"
    >
      <div className="md:px-[50px] flex items-center h-full">
        <BuyDustButton />
      </div>
      <div className="md:px-[50px] flex items-center gap-8 h-full">
        <div className="items-center gap-5 hidden md:flex">
          <Twitter width={20} className="fill-foregroundMed hover:fill-white" />
          <Discord width={25} className="fill-foregroundMed hover:fill-white" />
        </div>
        <SuperbowlButton
          disabled={disabled}
          buttonText={buttonText}
          handlePayToken={handlePayToken}
        />
      </div>
    </div>
  );
};

export default SuperbowlFooter;
