import { useRouter } from "next/router";
import Classic from "../../components/Classic/ClassicView";

const UrlClassic = () => {
  const router = useRouter();
  let { gameId } = router.query;

  // Temp special games
  // coin-toss, first-score, half, superbowl
  switch (gameId) {
    case "superbowl":
      gameId = "63e6ddc135e89b1d6d50e038";
      break;
    case "coin-toss":
      gameId = "63e6de6735e89b1d6d50e046";
      break;
    case "first-score":
      gameId = "63e6def735e89b1d6d50ec8c";
      break;
    case "half":
      gameId = "63e6df3135e89b1d6d50ec9a";
      break;
  }

  return (
    <>
      {/* Ensure gameId has registered */}
      {gameId && <Classic gameId={gameId} />}
    </>
  );
};

export default UrlClassic;
