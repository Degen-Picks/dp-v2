import { useRouter } from "next/router";
import { ClassicView } from "@/components";
import { withRedirect } from "@/utils/withRedirect";

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

export const getServerSideProps = withRedirect();
export default UrlClassic;
