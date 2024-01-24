import {
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  CreationDropMenu,
  CreationTextField,
  Divider,
  AgreeCheckbox,
  TwitterLoginButton,
  CreationTextFieldLong,
} from "@/components";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  WagerUserContext,
  WagerUserContextType,
} from "../stores/WagerUserStore";
import { ClassicGameOptions, League, LeaguesArray } from "@/types";
import { toast } from "sonner";
import { getAssets, getTimezoneStr, handleConfirmAction } from "@/utils";
import createClassic from "@/utils/api/classic/create";
import { useRouter } from "next/router";
import { LEAGUE_NAME_MAP, REVERSE_LEAGUE_NAME_MAP } from "@/utils/nameMap";

interface Props {
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

const ClassicSetup: FC<Props> = ({ setShowModal }) => {
  const { wagerUser } = useContext(WagerUserContext) as WagerUserContextType;

  // wallet variables
  const wallet = useWallet();
  const { publicKey } = wallet;
  const router = useRouter();

  // state
  const [leagues, setLeagues] = useState<LeaguesArray>([]);
  const [loading, setLoading] = useState(false);
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
  const [agree, setAgree] = useState(false);

  function getLeagueTeams(leagues: any, league: any) {
    const teams = leagues
      .find((e: any) => e.league === league)
      ?.options.map((e: any) => e.name);

    if (teams) {
      return teams.sort();
    }

    return null;
  }

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

      setLeagues(leagues);
    };

    fetchAssets();
  }, [publicKey]);

  // useEffect(() => {
  //   if (!!gameDetails.team1Name && !!gameDetails.team2Name) {
  //     setGameDetails({
  //       ...gameDetails,
  //       description: `${gameDetails.team1Name} vs. ${gameDetails.team2Name}`,
  //     });
  //   }
  // }, [gameDetails.league, gameDetails.team1Name, gameDetails.team2Name]);

  if (!wagerUser) return null;

  return (
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
              league.league === REVERSE_LEAGUE_NAME_MAP[gameDetails.league]
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
                  league.league === REVERSE_LEAGUE_NAME_MAP[gameDetails.league]
              )}
              list={getLeagueTeams(
                leagues,
                REVERSE_LEAGUE_NAME_MAP[gameDetails.league]
              )}
              gameDetails={gameDetails}
              setGameDetails={setGameDetails}
              accessor="team1Name"
              title="Team 1 / Record (optional)"
              disabled={gameDetails.league === "" || !wagerUser.twitterData}
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
                  league.league === REVERSE_LEAGUE_NAME_MAP[gameDetails.league]
              )}
              list={getLeagueTeams(
                leagues,
                REVERSE_LEAGUE_NAME_MAP[gameDetails.league]
              )}
              gameDetails={gameDetails}
              setGameDetails={setGameDetails}
              accessor="team2Name"
              title="Team 2 / Record (optional)"
              disabled={gameDetails.league === "" || !wagerUser.twitterData}
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
          placeholder="If you need more room to explain your pool..."
          fullWidth={true}
          textLeft={true}
          title="Pool details (optional)"
          disabled={!wagerUser.twitterData}
          limit={300}
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
  );
};

export default ClassicSetup;
