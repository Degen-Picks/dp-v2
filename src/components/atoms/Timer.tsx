import { FC, useEffect, useState } from "react";

interface Props {
  status: string;
  gameTime: number;
}

const Timer: FC<Props> = ({ status, gameTime }) => {
  const [timeRemaining, setTimeRemaining] = useState("");

  useEffect(() => {
    const calculateTimeRemaining = () => {
      var now = new Date().getTime();
      var gameDistance = gameTime - now;

      if (gameDistance < 0) {
        clearInterval(interval);
        setTimeRemaining("Picks Closed");
      } else {
        var days = Math.floor(gameDistance / (1000 * 60 * 60 * 24));
        var hours = Math.floor(
          (gameDistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        var minutes = Math.floor(
          (gameDistance % (1000 * 60 * 60)) / (1000 * 60)
        );

        setTimeRemaining(days + "d " + hours + "h " + minutes + "m");
      }
    };
    const interval = setInterval(calculateTimeRemaining, 60000);
    calculateTimeRemaining();

    return () => clearInterval(interval);
  }, [gameTime]);

  return (
    <div className="bg-light h-30 px-2 py-1 rounded-md flex items-center justify-center">
      {status === "closed" ? (
        <p className="text-sm text-secondary font-base-b">Picks Closed</p>
      ) : status === "completed" ? (
        <div className="flex items-center gap-1">
          <p className="text-sm text-correct font-base-b">Airdrops</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="10"
            width="10"
            viewBox="0 0 448 512"
            className="fill-correct"
          >
            <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
          </svg>
        </div>
      ) : status === "cancelled" ? (
        <p className="text-sm text-incorrect font-base-b">Refunded</p>
      ) : status === "upcoming" ? (
        <p className="text-sm text-secondary font-base-b">Loading</p>
      ) : (
        <p className="text-sm text-link font-base-b">{timeRemaining}</p>
      )}
    </div>
  );
};

export default Timer;
