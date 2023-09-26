import { useRouter } from "next/router";
import { ClassicView } from "@/components";
import { withRedirect } from "@/utils/withRedirect";
import { useEffect } from "react";
import { generalConfig } from "@/configs";

const UrlClassic = () => {
  const router = useRouter();
  let { gameId } = router.query;

  // useEffect(() => {
  //   const checkGameId = async () => {
  //     const headers = new Headers();
  //     headers.append("Content-Type", "application/json");

  //     const requestOptions = {
  //       method: "GET",
  //       headers: headers,
  //     };

  //     const response = await fetch(
  //       `${generalConfig.apiUrl}/api/wagers`,
  //       requestOptions
  //     );
  //     const body = await response.json();

  //     if (body.length === 0) return;

  //     let currentWager = null;

  //     // Search for gameId
  //     for (const wager of body) {
  //       if (wager._id === gameId) {
  //         currentWager = wager;
  //         break;
  //       }
  //     }

  //     if (currentWager === null) {
  //       router.push("/404");
  //       return;
  //     }
  //   };

  //   checkGameId();
  // }, [gameId, router]);

  // if (!gameId) return null;

  return (
    <>
      {/* Ensure gameId has registered */}
      {gameId && <ClassicView gameId={gameId} />}
    </>
  );
};

export const getServerSideProps = withRedirect();
export default UrlClassic;
