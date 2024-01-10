import { GameSetup } from "@/components";
import { withRedirect } from "@/utils/withRedirect";

const GameSetupPage = () => {
  return <GameSetup />;
};

export const getServerSideProps = withRedirect();
export default GameSetupPage;
