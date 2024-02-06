import { FC, useEffect, useState } from "react";
import BuyDustButton from "../atoms/BuyDustButton";
import SuperbowlButton from "../atoms/SuperbowlButton";
import { SuperbowlGameCard } from "@/types/Superbowl";

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
  const [buttonText, setButtonText] = useState<string>("One sec...");

  const disabled =
    !startDate || !endDate || Date.now() > endDate || buttonText !== "Submit";

  useEffect(() => {
    const updateButtonText = () => {
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

    // call once immediately and set an interval for updates
    updateButtonText();
    const timer = setInterval(updateButtonText, 1000); // update every second

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
      <div className="hidden md:flex w-full items-center justify-center h-full">
        <p className="text-[#404040]">Built by Degen Picks</p>
      </div>
      <div className="md:px-[50px] flex items-center h-full">
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
