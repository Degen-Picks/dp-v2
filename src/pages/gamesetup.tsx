import { useContext, useEffect, useState } from "react";
import {
  BackButton,
  Navbar,
  CreationDropMenu,
  CreationTextField,
  Divider,
  CreateModal,
  AgreeCheckbox,
  TwitterLoginButton,
  CreationTextFieldLong,
} from "@/components";
import { useWallet } from "@solana/wallet-adapter-react";
import { getTimezoneStr } from "../utils/dateUtil";
import { getAssets } from "../utils/api/apiUtil";
import toast from "react-hot-toast";
import { ClassicGameOptions, League, LeaguesArray } from "@/types";
import { useRouter } from "next/router";
import { handleConfirmAction } from "@/utils";
import {
  WagerUserContext,
  WagerUserContextType,
} from "@/components/stores/WagerUserStore";
import createClassic from "@/utils/api/classic/create";
import { withRedirect } from "@/utils/withRedirect";
import { generalConfig } from "@/configs";
import {
  COLLECTION_NAME_MAP,
  LEAGUE_NAME_MAP,
  REVERSE_LEAGUE_NAME_MAP,
} from "@/utils/nameMap";

function getCollections(collections: any) {
  return collections.map((collection: any) => collection.name);
}

function getLeagueTeams(leagues: any, league: any) {
  const teams = leagues
    .find((e: any) => e.league === league)
    ?.options.map((e: any) => e.name);

  if (teams) {
    return teams.sort();
  }

  return null;
}

const GameSetup = () => {
  const { wagerUser } = useContext(WagerUserContext) as WagerUserContextType;

  // wallet variables
  const wallet = useWallet();
  const { publicKey } = wallet;

  const [gameDetails, setGameDetails] = useState<ClassicGameOptions>({
    league: "",
    team1Name: "",
    team1Record: "",
    team2Name: "",
    team2Record: "",
    title: "",
    description: "",
    gameTime: "",
    collection: "",
    token: "",
    info: "",
  });

  const [validGame, setValidGame] = useState(false);
  const [loading, setLoading] = useState(false);
  const [leagues, setLeagues] = useState<LeaguesArray>([]);
  const [collections, setCollections] = useState<LeaguesArray>([]);
  const [agree, setAgree] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const router = useRouter();

  const handleCreateGame = async () => {
    const toastId = toast.loading("Creating game...");
    setLoading(true);
    try {
      const confirm = await handleConfirmAction(
        wallet,
        "Are you sure you want to create this game?"
      );
      if (!confirm) throw new Error("User cancelled");

      if (wagerUser!.twitterData === null) {
        throw new Error("You must link your Twitter account to create a game.");
      }

      const { body } = await createClassic(gameDetails);
      const gameId = body.data._id;

      toast.success("Game created successfully!");
      router.push(`/${gameId}`);
    } catch (err: any) {
      console.log(err);
      toast.error(err.message || "Error contacting server. Try again later.");
    } finally {
      toast.dismiss(toastId);
      setLoading(false);
    }
  };

  useEffect(() => {
    const newGameDetails = { ...gameDetails };
    newGameDetails.team1Name = "";
    newGameDetails.team1Record = "";
    newGameDetails.team2Name = "";
    newGameDetails.team2Record = "";
    setGameDetails(newGameDetails);
  }, [gameDetails.league]);

  useEffect(() => {
    if (
      gameDetails.league !== "" &&
      gameDetails.team1Name !== "" &&
      gameDetails.team2Name !== "" &&
      gameDetails.title !== "" &&
      gameDetails.gameTime !== "" &&
      gameDetails.collection !== "" &&
      gameDetails.team1Name !== gameDetails.team2Name &&
      gameDetails.token !== ""
    ) {
      if (gameDetails.league !== LEAGUE_NAME_MAP.custom) {
        if (gameDetails.team1Record !== "" && gameDetails.team2Record !== "") {
          setValidGame(true);
        } else {
          setValidGame(false);
        }
      } else {
        setValidGame(true);
      }
    } else {
      setValidGame(false);
    }
  }, [gameDetails]);

  useEffect(() => {
    if (!publicKey) return;
    const fetchAssets = async () => {
      const assets = await getAssets();
      if (assets === null) return;

      const leagues: LeaguesArray = assets
        .filter((asset: League) => !asset.league.includes("collection"))
        .sort((a: League, b: League) => {
          if (a.league.toLowerCase() === "custom") return 1;
          if (b.league.toLowerCase() === "custom") return -1;
          return a.league.localeCompare(b.league);
        })
        .map((asset: League) => ({
          ...asset, // Spread existing properties
          name: LEAGUE_NAME_MAP[asset.league] || "Unknown", // Add the name property
        }));

      const collection: LeaguesArray = assets
        .filter((asset: League) => asset.league.includes("collection"))
        .map((asset: League) => ({
          ...asset,
          name: COLLECTION_NAME_MAP[asset.league] || "Unknown",
        }));

      setLeagues(leagues);
      setCollections(collection);
    };

    fetchAssets();
  }, [publicKey]);

  useEffect(() => {
    if (!!gameDetails.team1Name && !!gameDetails.team2Name) {
      setGameDetails({
        ...gameDetails,
        description: `${gameDetails.team1Name} vs. ${gameDetails.team2Name}`,
      });
    }
  }, [gameDetails.league, gameDetails.team1Name, gameDetails.team2Name]);

  useEffect(() => {
    if (publicKey) {
      setShowModal(true);
    }
  }, [publicKey]);

  useEffect(() => {
    console.log("wager user", wagerUser);
  }, [wagerUser]);

  return (
    <>
      <div className="w-full min-h-screen">
        <Navbar />
        <div className="relative sm:w-[400px] mx-auto pb-20 px-4 sm:px-0">
          <div className="absolute left-4 md:-left-32 -top-14">
            <BackButton
              text="All games"
              handleClick={() => router.push(generalConfig.appUrl)}
            />
          </div>
          <div className="my-16">
            <div className="w-fit mx-auto lg:mb-0">
              <div className="font-base-b text-center text-3xl text-black">
                Game Setup
              </div>
            </div>
          </div>
          {!publicKey && (
            <div className="w-full h-full flex justify-center items-center mt-20">
              Connect your wallet & Twitter/X to create a pool.
            </div>
          )}

          {publicKey && !!wagerUser && wagerUser?.roles.includes("CREATOR") && (
            <>
              <div
                className={`${
                  wagerUser.twitterData && "hidden"
                } w-full h-full flex justify-center items-center mb-10`}
              >
                <TwitterLoginButton text="Link to create a game" />
              </div>
              <div className="flex flex-col gap-5">
                <CreationDropMenu
                  league={leagues.find(
                    (league) =>
                      league.league ===
                      REVERSE_LEAGUE_NAME_MAP[gameDetails.league]
                  )}
                  list={leagues.map((league) => league.name!)}
                  gameDetails={gameDetails}
                  setGameDetails={setGameDetails}
                  accessor="league"
                  title="League"
                  disabled={!wagerUser.twitterData}
                />
                <div className="w-full flex items-center gap-5">
                  {gameDetails.league === LEAGUE_NAME_MAP.custom ? (
                    <CreationTextField
                      gameDetails={gameDetails}
                      setGameDetails={setGameDetails}
                      accessor="team1Name"
                      placeholder="ex: Buffalo Bills"
                      fullWidth={true}
                      textLeft={true}
                      title="Team 1 / Record (optional)"
                      disabled={!wagerUser.twitterData}
                      limit={12}
                    />
                  ) : (
                    <CreationDropMenu
                      league={leagues.find(
                        (league) =>
                          league.league ===
                          REVERSE_LEAGUE_NAME_MAP[gameDetails.league]
                      )}
                      list={getLeagueTeams(
                        leagues,
                        REVERSE_LEAGUE_NAME_MAP[gameDetails.league]
                      )}
                      gameDetails={gameDetails}
                      setGameDetails={setGameDetails}
                      accessor="team1Name"
                      title="Team 1 / Record (optional)"
                      disabled={
                        gameDetails.league === "" || !wagerUser.twitterData
                      }
                      icon={true}
                    />
                  )}
                  <CreationTextField
                    gameDetails={gameDetails}
                    setGameDetails={setGameDetails}
                    accessor="team1Record"
                    placeholder="0-0"
                    fullWidth={false}
                    disabled={!wagerUser.twitterData}
                    limit={7}
                  />
                </div>
                <div className="w-full flex items-center gap-5">
                  {gameDetails.league === LEAGUE_NAME_MAP.custom ? (
                    <CreationTextField
                      gameDetails={gameDetails}
                      setGameDetails={setGameDetails}
                      accessor="team2Name"
                      placeholder="ex: New York Jets"
                      fullWidth={true}
                      textLeft={true}
                      title="Team 2 / Record (optional)"
                      disabled={!wagerUser.twitterData}
                      limit={12}
                    />
                  ) : (
                    <CreationDropMenu
                      league={leagues.find(
                        (league) =>
                          league.league ===
                          REVERSE_LEAGUE_NAME_MAP[gameDetails.league]
                      )}
                      list={getLeagueTeams(
                        leagues,
                        REVERSE_LEAGUE_NAME_MAP[gameDetails.league]
                      )}
                      gameDetails={gameDetails}
                      setGameDetails={setGameDetails}
                      accessor="team2Name"
                      title="Team 2 / Record (optional)"
                      disabled={
                        gameDetails.league === "" || !wagerUser.twitterData
                      }
                      icon={true}
                    />
                  )}
                  <CreationTextField
                    gameDetails={gameDetails}
                    setGameDetails={setGameDetails}
                    accessor="team2Record"
                    placeholder="0-0"
                    fullWidth={false}
                    disabled={!wagerUser.twitterData}
                    limit={7}
                  />
                </div>
                <CreationTextField
                  gameDetails={gameDetails}
                  setGameDetails={setGameDetails}
                  accessor="description"
                  placeholder="-"
                  fullWidth={true}
                  textLeft={true}
                  title="Matchup"
                  disabled={true}
                />
                <CreationTextField
                  gameDetails={gameDetails}
                  setGameDetails={setGameDetails}
                  accessor="title"
                  placeholder="ex: Monday Night Football (Week 1)"
                  fullWidth={true}
                  textLeft={true}
                  title="Title"
                  disabled={!wagerUser.twitterData}
                  limit={72}
                />
                <CreationTextFieldLong
                  gameDetails={gameDetails}
                  setGameDetails={setGameDetails}
                  accessor="info"
                  placeholder="ex: If the Bills outscore the Jets by 10 points, the Bills win the pool."
                  fullWidth={true}
                  textLeft={true}
                  title="Pool details (optional)"
                  disabled={!wagerUser.twitterData}
                  limit={1000}
                />
                <CreationTextField
                  gameDetails={gameDetails}
                  setGameDetails={setGameDetails}
                  accessor="gameTime"
                  placeholder="mm/dd/yy --:-- PM"
                  fullWidth={true}
                  textLeft={true}
                  title={`Pool close (${getTimezoneStr(new Date())})`}
                  type="datetime-local"
                  disabled={!wagerUser.twitterData}
                />
                <CreationDropMenu
                  league={leagues.find(
                    (league) => league.league === gameDetails.league
                  )}
                  list={getCollections(collections)}
                  gameDetails={gameDetails}
                  setGameDetails={setGameDetails}
                  accessor="collection"
                  title="Branding"
                  disabled={!wagerUser.twitterData}
                />
                <CreationDropMenu
                  league={leagues.find(
                    (league) => league.league === gameDetails.league
                  )}
                  list={["DUST", "SOL", "USDC", "CROWN"]}
                  gameDetails={gameDetails}
                  setGameDetails={setGameDetails}
                  accessor="token"
                  title="Token"
                  icon={true}
                  disabled={!wagerUser.twitterData}
                />
              </div>
              <div className="py-2 w-full flex flex-col">
                <Divider color="#A89FA8" />
                <AgreeCheckbox
                  agree={agree}
                  setAgree={setAgree}
                  setShowModal={setShowModal}
                  disabled={!wagerUser.twitterData}
                />
                <Divider color="#A89FA8" />
              </div>
              <div className="w-full flex justify-between">
                <button
                  className="h-[50px] w-full bg-black hover:bg-[#333333] text-greyscale1
                  px-5 py-2 disabled:cursor-not-allowed disabled:bg-disabled"
                  onClick={handleCreateGame}
                  disabled={
                    !publicKey ||
                    !validGame ||
                    loading ||
                    !agree ||
                    !wagerUser.twitterData
                  }
                >
                  Create game
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <CreateModal showModal={showModal} setShowModal={setShowModal} />
    </>
  );
};

export const getServerSideProps = withRedirect();
export default GameSetup;
