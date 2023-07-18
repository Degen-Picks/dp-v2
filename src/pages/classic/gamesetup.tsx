import { useEffect, useState } from "react";
import {
  BackButton,
  Navbar,
  CreationDropMenu,
  CreationTextField,
} from "@/components";
import { useWallet } from "@solana/wallet-adapter-react";
import { getTimezoneStr } from "../../utils/dateUtil";
import {
  confirmSignature,
  createClassic,
  fetchNonce,
  getLoginStatus,
} from "../../utils/adminApiUtil";
import { getAssets } from "../../utils/apiUtil";
import toast from "react-hot-toast";
import { ClassicGameOptions, League, LeaguesArray } from "@/types";
import { useRouter } from "next/router";

function getCollections(collections: any) {
  return collections.map((collection: any) => collection.league);
}

function getLeagueTeams(leagues: any, league: any) {
  return leagues
    .find((e: any) => e.league === league)
    ?.options.map((e: any) => e.name);
}

const GameSetup = () => {
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
  const [verified, setVerified] = useState(false);

  const [assets, setAssets] = useState<LeaguesArray>([]);
  const [leagues, setLeagues] = useState<LeaguesArray>([]);
  const [collections, setCollections] = useState<LeaguesArray>([]);

  const router = useRouter();

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
      gameDetails.token !== ""
    ) {
      if (gameDetails.league !== "custom") {
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
    async function checkLoginStatus() {
      const loginStatus = await getLoginStatus();
      setVerified(loginStatus);
    }

    publicKey && checkLoginStatus();
  }, [publicKey]);

  useEffect(() => {
    const fetchAssets = async () => {
      const assets = await getAssets();
      if (assets === null) {
        setAssets([]);
        return;
      } else {
        setAssets(assets);
      }

      const leagues = assets.filter(
        (asset: League) => !asset.league.includes("collection")
      );
      const collection = assets.filter((asset: League) =>
        asset.league.includes("collection")
      );

      setLeagues(leagues);
      setCollections(collection);
    };

    fetchAssets();
  }, []);

  const handleCreateGame = async () => {
    const toastId = toast.loading("Creating game...");
    setLoading(true);
    try {
      const { body } = await createClassic(gameDetails, assets);
      const gameId = body.data._id;

      toast.success("Game created successfully!");
      router.push(`/classic/${gameId}`);
    } catch (err: any) {
      toast.error(err.message || "Error contacting server. Try again later.");
    } finally {
      toast.dismiss(toastId);
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!wallet.signMessage || !publicKey) return;

    const nonce = await fetchNonce(publicKey.toString());

    if (nonce.length <= 0) return;

    const tx = await wallet.signMessage(Buffer.from(nonce));
    const verified = await confirmSignature(
      publicKey.toString(),
      Buffer.from(tx).toString("hex")
    );
    toast.success("Verification successful");
    setVerified(verified);
  };

  if (!verified) {
    return (
      <div className="w-full min-h-screen">
        <Navbar />
        <div className="sm:w-[400px] mx-auto pb-20">
          <div className="my-8">
            <div className="w-fit mx-auto lg:mb-0">
              <div className=" font-pressura text-center">Picks Classic</div>
              <div className="font-bingodilan text-center text-3xl text-black">
                Game Setup
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <div className="w-full flex items-center gap-5">
              <div className="w-1/2">
                <BackButton />
              </div>
              <div className="w-1/2">
                <button
                  className="w-full h-12 bg-black text-white rounded-lg font-bold text-lg"
                  onClick={handleLogin}
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      <Navbar />
      <div className="sm:w-[400px] mx-auto pb-20">
        <div className="my-8">
          <div className="w-fit mx-auto lg:mb-0">
            <div className=" font-pressura text-center">Picks Classic</div>
            <div className="font-bingodilan text-center text-3xl text-black">
              Game Setup
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <CreationDropMenu
            list={leagues.map((league) => league.league)}
            gameDetails={gameDetails}
            setGameDetails={setGameDetails}
            accessor="league"
            title="League"
          />
          <div className="w-full flex items-center gap-5">
            {gameDetails.league === "custom" ? (
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
                list={getLeagueTeams(leagues, gameDetails.league)}
                gameDetails={gameDetails}
                setGameDetails={setGameDetails}
                accessor="team1Name"
                title="Team 1 / Record (optional)"
                disabled={gameDetails.league === ""}
                // icon={true}
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
            {gameDetails.league === "custom" ? (
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
                list={getLeagueTeams(leagues, gameDetails.league)}
                gameDetails={gameDetails}
                setGameDetails={setGameDetails}
                accessor="team2Name"
                title="Team 2 / Record (optional)"
                disabled={gameDetails.league === ""}
                // icon={true}
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
            accessor="title"
            placeholder="ex: Buffalo Bills @ New York Jets"
            fullWidth={true}
            textLeft={true}
            title="Title"
          />
          <CreationTextField
            gameDetails={gameDetails}
            setGameDetails={setGameDetails}
            accessor="description"
            placeholder="ex: Monday Night Football (Week 1)"
            fullWidth={true}
            textLeft={true}
            title="Description (optional)"
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
            list={getCollections(collections)}
            gameDetails={gameDetails}
            setGameDetails={setGameDetails}
            accessor="collection"
            title="Collection"
          />
          <CreationDropMenu
            list={["DUST"]}
            gameDetails={gameDetails}
            setGameDetails={setGameDetails}
            accessor="token"
            title="Token"
            icon={true}
          />
        </div>
        <div className="w-full flex justify-between mt-10">
          <BackButton />
          <button
            className="h-[50px] w-full bg-black text-white
            px-5 py-2 disabled:cursor-not-allowed disabled:bg-[#979797]"
            onClick={handleCreateGame}
            disabled={!publicKey || !validGame || loading}
          >
            Create game
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameSetup;
