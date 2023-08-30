import { useRouter } from "next/router";
import { ClassicView } from "@/components";

const UrlClassic = () => {
  const router = useRouter();
  let { gameId } = router.query;

  return (
    <>
      {/* Ensure gameId has registered */}
      {gameId && <ClassicView gameId={gameId} />}
    </>
  );
};

export default UrlClassic;
