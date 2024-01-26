import { FC, useEffect, useState } from "react";

interface Props {
  status: string;
  gameTime: number;
}

const Timer: FC<Props> = ({ status, gameTime }) => {
  const [timeRemaining, setTimeRemaining] = useState("");
  const [closeToEnd, setCloseToEnd] = useState(false);

  const timeAgo = () => {
    const now = new Date().getTime();
    const gameDistance = now - gameTime;

    var days = Math.floor(gameDistance / (1000 * 60 * 60 * 24));
    var hours = Math.floor(
      (gameDistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    var minutes = Math.floor((gameDistance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((gameDistance % (1000 * 60)) / 1000);

    if (days === 0 && hours >= 1) {
      return hours + "h ago";
    } else if (days === 0 && hours < 1) {
      return minutes + "m ago";
    } else {
      return days + "d ago";
    }
  };

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
        <p className="text-greyscale6">Awaiting winner</p>
      ) : status === "completed" ? (
        <p className="text-greyscale4">{timeAgo()}</p>
      ) : status === "cancelled" ? (
        <p className="text-greyscale4">Refunded</p>
      ) : status === "upcoming" ? (
        <p className="text-greyscale4">Loading</p>
      ) : (
        <p className={`${closeToEnd ? "text-incorrect" : "text-greyscale6"}`}>
          {timeRemaining}
        </p>
      )}
    </div>
  );
};

export default Timer;
