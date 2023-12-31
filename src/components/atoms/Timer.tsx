import { FC, useEffect, useState } from "react";

interface Props {
  status: string;
  gameTime: number;
  winner: string | null;
}

const Timer: FC<Props> = ({ status, gameTime, winner }) => {
  const [timeRemaining, setTimeRemaining] = useState("");
  const [closeToEnd, setCloseToEnd] = useState(false);

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
        var seconds = Math.floor((gameDistance % (1000 * 60)) / 1000);

        if (days === 0 && hours >= 1) {
          setCloseToEnd(false);
          setTimeRemaining(hours + "h " + minutes + "m");
        } else if (days === 0 && hours < 1) {
          setTimeRemaining(minutes + "m " + seconds + "s");
          setCloseToEnd(true);
        } else {
          setTimeRemaining(days + "d " + hours + "h " + minutes + "m");
          setCloseToEnd(false);
        }
      }
    };
    const interval = setInterval(calculateTimeRemaining, 1000);
    calculateTimeRemaining();

    return () => clearInterval(interval);
  }, [gameTime]);

  return (
    <div className="flex items-center justify-center whitespace-nowrap text-lg">
      {status === "closed" ? (
        <p className="">Picks Closed</p>
      ) : status === "completed" ? (
        <div className="flex items-center gap-1">
          <p className="text-correct">{winner}</p>
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
        <p className="text-incorrect">Refunded</p>
      ) : status === "upcoming" ? (
        <p className="text-greyscale4">Loading</p>
      ) : (
        <p className={`${closeToEnd ? "text-incorrect" : "text-purple1"}`}>
          {timeRemaining}
        </p>
      )}
    </div>
  );
};

export default Timer;
