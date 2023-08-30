import { useContext, useEffect, useState } from "react";
import {
  BackButton,
  Navbar,
  CreationDropMenu,
  CreationTextField,
  Divider,
  CreateModal,
  AgreeCheckbox,
} from "@/components";
import { useWallet } from "@solana/wallet-adapter-react";
import { getTimezoneStr } from "../utils/dateUtil";
import { getAssets, getLoginStatus } from "../utils/api/apiUtil";
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
import { COLLECTION_NAME_MAP, LEAGUE_NAME_MAP, REVERSE_LEAGUE_NAME_MAP } from "@/utils/nameMap";

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
  });

  const [validGame, setValidGame] = useState(false);
  const [loading, setLoading] = useState(false);
  const [headlineDisabled, setHeadlineDisabled] = useState(true);
  const [assets, setAssets] = useState<LeaguesArray>([]);
  const [leagues, setLeagues] = useState<LeaguesArray>([]);
  const [collections, setCollections] = useState<LeaguesArray>([]);
  const [agree, setAgree] = useState(false);
  const [showModal, setShowModal] = useState(true);

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
      if (gameDetails.league !== REVERSE_LEAGUE_NAME_MAP["custom"]) {
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
    const fetchAssets = async () => {
      const assets = await getAssets();
      if (assets === null) {
        setAssets([]);
        return;
      } else {
        setAssets(assets);
      }

      const leagues: LeaguesArray = assets
        .filter((asset: League) => !asset.league.includes("collection"))
        .sort((a: League, b: League) => {
          if (a.league.toLowerCase() === "custom") return 1;
          if (b.league.toLowerCase() === "custom") return -1;
          return a.league.localeCompare(b.league);
        })
        .map((asset: League) => ({
          ...asset, // Spread existing properties
          name: LEAGUE_NAME_MAP[asset.league] || 'Unknown', // Add the name property
      }));

      const collection: LeaguesArray = assets
        .filter((asset: League) => asset.league.includes("collection"))
        .map((asset: League) => ({
          ...asset,
          name: COLLECTION_NAME_MAP[asset.league] || 'Unknown',
      }));
      

      setLeagues(leagues);
      setCollections(collection);
    };

    fetchAssets();
  }, []);

  useEffect(() => {
    if (gameDetails.league === REVERSE_LEAGUE_NAME_MAP["custom"]) {
      setHeadlineDisabled(false);
    } else {
      setHeadlineDisabled(true);
      if (!!gameDetails.team1Name && !!gameDetails.team2Name) {
        setGameDetails({
          ...gameDetails,
          description: `${gameDetails.team1Name} vs. ${gameDetails.team2Name}`,
        });
      }
    }
  }, [gameDetails.league, gameDetails.team1Name, gameDetails.team2Name]);

  return (
    <>
      <div className="w-full min-h-screen">
        <Navbar />

        {!wagerUser || !wagerUser?.roles.includes("CREATOR") ? (
          <div className="w-full h-full flex justify-center items-center mt-20">
            <div className="text-xl font-bold">
              You are not authorized to view this page.
              <br />
              Please log in with your wallet to continue.
            </div>
          </div>
        ) : (
          <div className="relative sm:w-[400px] mx-auto pb-20">
            <div className="absolute -left-32 -top-14">
              <BackButton
                text="All games"
                handleClick={() => router.push(generalConfig.appUrl)}
              />
            </div>
            <div className="my-12">
              <div className="w-fit mx-auto lg:mb-0">
                <div className="font-base-b text-center text-3xl text-black">
                  Game Setup
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <CreationDropMenu
                league={leagues.find(
                  (league) => league.league === gameDetails.league
                )}
                list={leagues.map((league) => league.name!)}
                gameDetails={gameDetails}
                setGameDetails={setGameDetails}
                accessor="league"
                title="League"
              />
              <div className="w-full flex items-center gap-5">
                {gameDetails.league === REVERSE_LEAGUE_NAME_MAP["custom"] ? (
                  <CreationTextField
                    gameDetails={gameDetails}
                    setGameDetails={setGameDetails}
                    accessor="team1Name"
                    placeholder="ex: Buffalo Bills"
                    fullWidth={true}
                    textLeft={true}
                    title="Team 1 / Record (optional)"
                  />
                ) : (
                  <CreationDropMenu
                    league={leagues.find(
                      (league) => league.league === gameDetails.league
                    )}
                    list={getLeagueTeams(leagues, gameDetails.league)}
                    gameDetails={gameDetails}
                    setGameDetails={setGameDetails}
                    accessor="team1Name"
                    title="Team 1 / Record (optional)"
                    disabled={gameDetails.league === ""}
                    icon={true}
                  />
                )}
                <CreationTextField
                  gameDetails={gameDetails}
                  setGameDetails={setGameDetails}
                  accessor="team1Record"
                  placeholder="0-0"
                  fullWidth={false}
                />
              </div>
              <div className="w-full flex items-center gap-5">
                {gameDetails.league === REVERSE_LEAGUE_NAME_MAP["custom"] ? (
                  <CreationTextField
                    gameDetails={gameDetails}
                    setGameDetails={setGameDetails}
                    accessor="team2Name"
                    placeholder="ex: New York Jets"
                    fullWidth={true}
                    textLeft={true}
                    title="Team 2 / Record (optional)"
                  />
                ) : (
                  <CreationDropMenu
                    league={leagues.find(
                      (league) => league.league === gameDetails.league
                    )}
                    list={getLeagueTeams(leagues, gameDetails.league)}
                    gameDetails={gameDetails}
                    setGameDetails={setGameDetails}
                    accessor="team2Name"
                    title="Team 2 / Record (optional)"
                    disabled={gameDetails.league === ""}
                    icon={true}
                  />
                )}
                <CreationTextField
                  gameDetails={gameDetails}
                  setGameDetails={setGameDetails}
                  accessor="team2Record"
                  placeholder="0-0"
                  fullWidth={false}
                />
              </div>
              <CreationTextField
                gameDetails={gameDetails}
                setGameDetails={setGameDetails}
                accessor="description"
                placeholder="-"
                fullWidth={true}
                textLeft={true}
                title="Headline"
                disabled={headlineDisabled}
              />
              <CreationTextField
                gameDetails={gameDetails}
                setGameDetails={setGameDetails}
                accessor="title"
                placeholder="ex: Monday Night Football (Week 1)"
                fullWidth={true}
                textLeft={true}
                title="Title"
              />
              <CreationTextField
                gameDetails={gameDetails}
                setGameDetails={setGameDetails}
                accessor="gameTime"
                placeholder="mm/dd/yy --:-- PM"
                fullWidth={true}
                textLeft={true}
                title={`Game time (${getTimezoneStr(new Date())})`}
                type="datetime-local"
              />
              <CreationDropMenu
                league={leagues.find(
                  (league) => league.league === gameDetails.league
                )}
                list={getCollections(collections)}
                gameDetails={gameDetails}
                setGameDetails={setGameDetails}
                accessor="collection"
                title="Collection"
              />
              <CreationDropMenu
                league={leagues.find(
                  (league) => league.league === gameDetails.league
                )}
                list={["DUST", "SOL", "USDC"]}
                gameDetails={gameDetails}
                setGameDetails={setGameDetails}
                accessor="token"
                title="Token"
                icon={true}
              />
            </div>
            <div className="py-2 w-full flex flex-col">
              <Divider />
              <AgreeCheckbox
                agree={agree}
                setAgree={setAgree}
                setShowModal={setShowModal}
              />
              <Divider />
            </div>
            <div className="w-full flex justify-between">
              <button
                className="h-[50px] w-full bg-black text-white
                px-5 py-2 disabled:cursor-not-allowed disabled:bg-[#979797]"
                onClick={handleCreateGame}
                disabled={!publicKey || !validGame || loading || !agree}
              >
                Create game
              </button>
            </div>
          </div>
        )}
      </div>
      <CreateModal showModal={showModal} setShowModal={setShowModal} />
    </>
  );
};

export const getServerSideProps = withRedirect();
export default GameSetup;