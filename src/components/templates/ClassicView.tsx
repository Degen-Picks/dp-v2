import { FC, useContext, useEffect, useState } from "react";
import Image from "next/image";
import {
  Navbar,
  RewardPool,
  ClassicVersusBox,
  Divider,
  ViewToggle,
  ActivityFeed,
  ManageGame,
  RulesModal,
  QuestionIcon,
  ClassicHero,
  AlertBanner2,
  InfoIcon,
  InfoModal,
} from "@/components";
// solana wallet + utils
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getTokenBalance } from "../../utils/getTokenBalance";
import toast from "react-hot-toast";
import { generalConfig } from "@/configs";
import { getDateStr, getTimeStr, getDayTime } from "../../utils/dateUtil";
import { getCurrencyIcon, pickFee, sleep } from "../../utils";
import { GameInfo, Wager } from "@/types";
import { ToggleConfig } from "../molecules/ViewToggle";
import {
  WagerUserContext,
  WagerUserContextType,
} from "../stores/WagerUserStore";
import sendTransaction from "../../utils/sendTransaction";
import { TOKEN_MAP } from "@/types/Token";
import Confetti from "react-confetti";
import { useWindowSize } from "@/hooks/useWindowSize";
import { BarLoader } from "react-spinners";

interface Props {
  gameId: string | string[];
}

export enum GameStatus {
  PREGAME = "upcoming",
  OPEN = "live",
  CLOSED = "closed",
  AIRDROPPED = "completed",
  CANCELLED = "cancelled",
}

const Classic: FC<Props> = ({ gameId }) => {
  const { wagerUser } = useContext(WagerUserContext) as WagerUserContextType;

  //state variables
  const [pickCountdown, setPickCountdown] = useState<string>("Loading...");
  const [winningTeam, setWinningTeam] = useState<string>();
  const [tokenBet, setTokenBet] = useState<number>(33);
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [isBroke, setIsBroke] = useState<boolean>(false);
  const [rewardEstimate, setRewardEstimate] = useState<string>("--");
  const [success, setSuccess] = useState<boolean>(false);
  const [txn, setTxn] = useState<string>();
  const [txnLoading, setTxnLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);
  const [agree, setAgree] = useState<boolean>(false);
  const [winAmount, setWinAmount] = useState<number>(0);
  const [airdropTxn, setAirdropTxn] = useState<string>();
  const [pickRefresh, setPickRefresh] = useState<boolean>(false);
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.PREGAME);

  const [utcPickDate, setUtcPickDate] = useState<number>(); // Date picks open
  const [utcGameDate, setUtcGameDate] = useState<number>(); // Date picks close

  const [finalWinner, setFinalWinner] = useState<string>();

  const [minimumBet, setMinimumBet] = useState<number>(1);

  const [toggleConfig, setToggleConfig] = useState<ToggleConfig>({
    option1: {
      title: "Game",
    },
    option2: {
      title: "Activity",
    },
    option3: {
      title: "Manage",
    },
    selected: "option1",
  });

  // wallet variables
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();

  const [width, height] = useWindowSize();

  const [gameData, setGameData] = useState<GameInfo>({
    gameInfo: {
      description: "",
      endDate: 0,
      finalScore: "",
      gameDate: 0,
      league: "",
      metadata: "",
      // selections: "",
      startDate: 0,
      status: "",
      title: "",
      id: "",
      dateStr: "",
      timeStr: "",
      dayTime: "",
      token: null,
    },
    team1: {
      teamName: "TBD",
      teamLogo: "",
      winnerImageUrl: "",
      nftImageUrl: "",
      dustVol: 0,
      uniqueWallets: 0,
      publicKey: "",
      id: "",
      record: "",
      winner: false,
    },
    team2: {
      teamName: "TBD",
      teamLogo: "",
      winnerImageUrl: "",
      nftImageUrl: "",
      dustVol: 0,
      uniqueWallets: 0,
      publicKey: "",
      id: "",
      record: "",
      winner: false,
    },
  });

  const rulesDisabled = success || loading || gameStatus !== GameStatus.OPEN;

  // create and process dust txn
  const handlePayToken = async () => {
    if (!gameData || !publicKey) return;
    const toastId = toast.loading("Processing Transaction...");
    setTxnLoading(true);
    if (!isBroke) {
      const team = gameData.team1.teamName === winningTeam ? "team1" : "team2";
      const selectionId = gameData[team].id;
      const escrowPublicKey = gameData[team].publicKey;

      // Send dust to our wallet
      const txHash = await sendTransaction(
        publicKey,
        signTransaction,
        connection,
        tokenBet,
        escrowPublicKey,
        gameData.gameInfo.token!
      );

      // Check tx went through
      if (txHash && (await sendPlaceBet(txHash, selectionId, 0))) {
        toast.success("Success!", {
          id: toastId,
        });

        // Load fresh game data
        await loadGameData();

        // update txn hash
        setTxn(txHash);

        // show success UX
        setSuccess(true);
        setAgree(true);
        // document.body.scrollTop = document.documentElement.scrollTop = 0;
      } else {
        toast.error("Transaction cancelled or failed.", {
          id: toastId,
        });
      }
    } else {
      toast.error("Insufficient DUST balance.", {
        id: toastId,
      });
    }
    setTxnLoading(false);
  };

  const sendPlaceBet = async (
    signature: string,
    selectionId: string,
    retries: number
  ): Promise<any> => {
    if (!gameData || !publicKey) return;
    try {
      const headers = new Headers();
      headers.append("Content-Type", "application/json");

      const requestOptions = {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          wagerId: gameData.gameInfo.id,
          selectionId,
          signature,
          publicKey: publicKey.toString(),
        }),
      };

      const response = await fetch(
        `${generalConfig.apiUrl}/api/placeBet`,
        requestOptions
      );
      const body = await response.json();

      if (response.status === 200) {
        return true;
      } else {
        if (body.message === "Invalid transaction signature" || retries < 5) {
          console.log("Should retry!");

          await sleep(1000);
          return await sendPlaceBet(signature, selectionId, retries + 1);
        }
        toast.error(body.message);
        return false;
      }
    } catch (err) {
      console.log(`Error placing bet ${err}`);
      return false;
    }
  };

  const loadGameData = async (): Promise<GameInfo | undefined | null> => {
    try {
      const headers = new Headers();
      headers.append("Content-Type", "application/json");

      const requestOptions = {
        method: "GET",
        headers: headers,
      };

      const response = await fetch(
        `${generalConfig.apiUrl}/api/wagers`,
        requestOptions
      );
      const body = await response.json();

      if (body.length === 0) return;

      let currentWager = null;

      // Search for gameId
      for (const wager of body) {
        if (wager._id === gameId) {
          currentWager = wager;
          console.log("Found game by id", wager);
          break;
        }
      }

      if (currentWager === null) {
        // Pick wager based on open time
        const liveGames = body.filter(
          (wager: Wager) => wager.status === "live"
        );
        if (liveGames.length > 0) {
          currentWager = liveGames.sort(
            (a: Wager, b: Wager) => a.startDate - b.startDate
          )[0];
        } else {
          currentWager = body.reverse()[0];
        }
        console.log("Found game by time", currentWager);
      }

      const gameDate = new Date(currentWager.gameDate);

      // TODO: we can inherit the type from the backend (using typeof return value)
      const parsed: GameInfo = {
        gameInfo: {
          description: currentWager.description,
          endDate: currentWager.endDate,
          finalScore: currentWager.finalScore,
          gameDate: currentWager.gameDate,
          league: currentWager.league,
          metadata: currentWager.metadata,
          // selections: currentWager.selected,
          startDate: currentWager.startDate,
          status: currentWager.status,
          title: currentWager.title,
          creator: currentWager.creator,
          id: currentWager._id,
          dateStr: getDateStr(gameDate),
          timeStr: getTimeStr(gameDate),
          dayTime: getDayTime(gameDate),
          token: currentWager.token,
        },
        team1: {
          teamName: currentWager.selections[0].title,
          teamLogo: currentWager.selections[0].imageUrl,
          winnerImageUrl: currentWager.selections[0].winnerImageUrl,
          nftImageUrl: currentWager.selections[0].nftImageUrl,
          dustVol: currentWager.selections[0].totalSpent,
          uniqueWallets: currentWager.selections[0].totalUsers,
          publicKey: currentWager.selections[0].publicKey || "",
          id: currentWager.selections[0]._id,
          record: currentWager.selections[0].record,
          winner: currentWager.selections[0].winner,
        },
        team2: {
          teamName: currentWager.selections[1].title,
          teamLogo: currentWager.selections[1].imageUrl,
          winnerImageUrl: currentWager.selections[1].winnerImageUrl,
          nftImageUrl: currentWager.selections[1].nftImageUrl,
          dustVol: currentWager.selections[1].totalSpent,
          uniqueWallets: currentWager.selections[1].totalUsers,
          publicKey: currentWager.selections[1].publicKey || "",
          id: currentWager.selections[1]._id,
          record: currentWager.selections[1].record,
          winner: currentWager.selections[1].winner,
        },
      };

      let newGameStatus: GameStatus = GameStatus.PREGAME;

      switch (parsed.gameInfo.status) {
        case "upcoming":
          newGameStatus = GameStatus.PREGAME;
          break;
        case "live":
          newGameStatus = GameStatus.OPEN;
          break;
        case "closed":
          newGameStatus = GameStatus.CLOSED;
          break;
        case "completed":
          newGameStatus = GameStatus.AIRDROPPED;
          break;
        case "cancelled":
          newGameStatus = GameStatus.CANCELLED;
          break;
      }

      if (parsed.gameInfo.token === "SOL") {
        setMinimumBet(0.1);
      } else {
        setMinimumBet(TOKEN_MAP[parsed.gameInfo.token!].minimum);
      }

      setGameStatus(newGameStatus);
      setGameData(parsed);

      // Cut end date short to include last second picks
      setUtcGameDate(currentWager.endDate - 5000);

      // Add a little buffer so backend has time to update
      setUtcPickDate(currentWager.startDate + 5000);

      return parsed;
    } catch (err) {
      console.log(`Error fetching game data ${err}`);
      return null;
    }
  };

  const buttonDisabled =
    isBroke ||
    winningTeam === undefined ||
    tokenBet === undefined ||
    tokenBet < minimumBet ||
    agree === false ||
    txnLoading ||
    gameStatus !== GameStatus.OPEN;

  // updates button text based current state
  const buttonHandler = () => {
    if (
      gameStatus !== GameStatus.OPEN &&
      !success &&
      gameStatus !== GameStatus.PREGAME
    ) {
      {
        /* betting is over and you didn't pick */
      }
      return "Picks closed";
    } else if (gameStatus === GameStatus.PREGAME) {
      // game just created, waiting to start...
      return "Picks open soon...";
    } else if (winningTeam === undefined && gameStatus === GameStatus.OPEN) {
      {
        /* forgot to pick a winning team */
      }
      return "Select a winning team";
    } else if (isBroke && winningTeam && gameStatus === GameStatus.OPEN) {
      {
        /* broke but picked a team */
      }
      return `Insufficient ${gameData.gameInfo.token} balance`;
    } else if (
      !isBroke &&
      winningTeam &&
      (tokenBet === null || tokenBet < minimumBet || rewardEstimate === "--") &&
      gameStatus === GameStatus.OPEN
    ) {
      {
        /* not broke, picked a team, invalid dust bet */
      }
      return `Invalid ${gameData.gameInfo.token} value`;
    } else if (
      !isBroke &&
      winningTeam &&
      !agree &&
      tokenBet !== null &&
      tokenBet >= minimumBet &&
      gameStatus === GameStatus.OPEN
    ) {
      {
        /* not broke, picked a team, valid bet, checkbox unclicked */
      }
      return "Agree to the terms";
    } else if (
      !isBroke &&
      winningTeam &&
      tokenBet !== null &&
      tokenBet >= minimumBet &&
      agree &&
      gameStatus === GameStatus.OPEN
    ) {
      {
        /* not broke, picked a team, valid dust bet */
      }
      return "F*ck it, we ball";
    }

    // return "Waiting for game to open";
  };

  const pickHandler = (teamNum: number) => {
    if (teamNum === 1) {
      setWinningTeam(
        winningTeam === gameData.team1.teamName
          ? undefined
          : gameData.team1.teamName
      );
    } else {
      setWinningTeam(
        winningTeam === gameData.team2.teamName
          ? undefined
          : gameData.team2.teamName
      );
    }
  };

  // timer for countdown to game time (bets closed)
  // set and update a countdown timer every second
  const startGameDateCountdown = () => {
    const gameCountdownLogic = () => {
      // get today's date and time
      var now = new Date().getTime();

      // find the gameDistance between now and the count down date
      if (utcGameDate === undefined) return;
      var gameDistance = utcGameDate - now;

      // if the count down is finished, write some text
      if (gameDistance < 0) {
        clearInterval(interval);
        setGameStatus(GameStatus.CLOSED);
      }
    };

    gameCountdownLogic();
    const interval = setInterval(gameCountdownLogic, 1000);

    return () => clearInterval(interval);
  };

  // same countdown logic as before but with picks opening
  const startPickDateCountdown = () => {
    const pickCountdownLogic = async () => {
      // get today's date and time
      var now = new Date().getTime();

      // find the gameDistance between now and the count down date
      if (utcPickDate === undefined) return;
      var pickDistance = utcPickDate - now;

      // time calculations for days, hours, minutes and seconds (pick time - bets open)
      var minutes = Math.floor((pickDistance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((pickDistance % (1000 * 60)) / 1000);

      // display the result
      setPickCountdown(minutes + "m " + seconds + "s ");

      // if the count down is finished, write some text
      if (pickDistance < 0) {
        clearInterval(interval);

        setPickCountdown("LIVE!");

        // Load fresh game data (load pick publicKeys)
        const response = await loadGameData();

        if (response !== null) {
          setGameStatus(GameStatus.OPEN);

          startGameDateCountdown();
        }
        // TODO: add else case if response is null
        // we will want to restart a timer indicating we're waiting for backend to catch up
      }
    };

    pickCountdownLogic();
    const interval = setInterval(pickCountdownLogic, 1000);

    return () => clearInterval(interval);
  };

  useEffect(() => {
    if (!loading && utcPickDate !== undefined && utcGameDate !== undefined) {
      if (gameStatus === GameStatus.CANCELLED) {
        // setGameStatus("Picks refunded.");
        return;
      }

      if (new Date().getTime() > utcGameDate) {
        setGameStatus(GameStatus.CLOSED);
      } else if (new Date().getTime() > utcPickDate) {
        setGameStatus(GameStatus.OPEN);
        startGameDateCountdown();
      } else {
        startPickDateCountdown();
      }
    }
  }, [loading, utcPickDate, utcGameDate, gameStatus]);

  // Refresh game data
  useEffect(() => {
    let interval: any = null;
    if (gameStatus === GameStatus.OPEN && !pickRefresh) {
      setPickRefresh(true);

      interval = setInterval(async () => {
        const refreshed = await loadGameData();
        if (refreshed && gameStatus !== GameStatus.OPEN) {
          clearInterval(interval);
        }
      }, 7500);
    }

    return () => clearInterval(interval);
  }, [gameStatus]);

  useEffect(() => {
    async function loadPick() {
      await loadGameData();
      // show loader for 2 seconds more than needed
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }

    loadPick();
  }, []);

  // check if the user has enough dust each time the bet or wallet changes
  useEffect(() => {
    async function fetchWalletData() {
      if (publicKey && gameData.gameInfo.token) {
        const balance = await getTokenBalance(
          publicKey,
          connection,
          gameData.gameInfo.token
        );
        setTokenBalance(balance);

        // check if the user doesn't have enough DUST
        const userIsBroke = tokenBet > balance;
        // update state
        setIsBroke(userIsBroke);
      }
    }

    fetchWalletData();
  }, [publicKey, tokenBet, connection, gameData.gameInfo.token]);

  // show modal whenever a wallet is connected
  // useEffect(() => {
  //   if (publicKey) {
  //     if (gameStatus === GameStatus.OPEN) setShowModal(true);
  //   } else {
  //     setShowModal(false);
  //     setSuccess(false);
  //   }
  // }, [publicKey, gameStatus]);

  useEffect(() => {
    const loadUserPick = async (wagerId: string) => {
      try {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");

        const requestOptions = {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            wagerId,
            publicKey,
          }),
        };

        try {
          const response = await fetch(
            `${generalConfig.apiUrl}/api/getUserWager`,
            requestOptions
          );
          const body = await response.json();

          if (response.status === 200 && body.data.length >= 1) {
            const userPick = body.data[0];
            const userPickAmount = userPick.amounts[0];
            const userPickId = userPick.selectionId;

            setTxn(userPickAmount.signature);

            setTokenBet(userPickAmount.amount ?? 0);

            setSuccess(true);
            setAgree(true);

            if (gameStatus === GameStatus.CANCELLED) {
              if (userPick.transferData.signature) {
                setAirdropTxn(userPick.transferData.signature);
              }
              return;
            }

            const pickedTeam =
              gameData.team1.id === userPickId ? "team1" : "team2";
            const otherTeam = pickedTeam === "team1" ? "team2" : "team1";

            setWinningTeam(gameData[pickedTeam].teamName);

            // console.log("THE TEAM YOU PICKED: ", gameData[pickedTeam].teamName);

            if (userPick.winAmount === -1) {
              setFinalWinner(gameData[otherTeam].teamName);
              setWinAmount(-1);
            } else if (userPick.transferData?.signature) {
              setAirdropTxn(userPick.transferData.signature);
              setFinalWinner(gameData[pickedTeam].teamName);
              setWinAmount(userPick.transferData.amount);
            }
          }
        } catch (err) {
          console.log(`Error fetching user pick ${err}`);
          return;
        }
      } catch (err) {
        console.log(`Error loading user pick ${err}`);
      }
    };

    const fetchUserPick = async () => {
      if (!loading && publicKey && gameStatus !== GameStatus.PREGAME) {
        await loadUserPick(gameData.gameInfo.id);
      }
    };

    fetchUserPick();
  }, [publicKey, gameStatus, gameData, loading]);

  // update reward predictions each time we change pick, dust wager, or incoming game data changes
  useEffect(() => {
    const estimateRewards = () => {
      if (
        winningTeam === undefined ||
        tokenBet < minimumBet ||
        Number.isNaN(tokenBet)
      ) {
        setRewardEstimate("--");
        return;
      }
      var teamVolume =
        gameData[winningTeam === gameData.team1.teamName ? "team1" : "team2"]
          .dustVol;

      var totalVol;
      // if user hasn't bet yet, factor in user bet in potential reward
      if (!success) {
        teamVolume = teamVolume + tokenBet;
        totalVol = gameData.team1.dustVol + gameData.team2.dustVol + tokenBet;
      } else {
        totalVol = gameData.team1.dustVol + gameData.team2.dustVol;
      }

      const multiplier = totalVol / teamVolume;
      let estimatedReward =
        Math.floor((tokenBet - tokenBet * pickFee) * multiplier * 100) / 100;

      if (!estimatedReward) {
        estimatedReward = totalVol;
      }

      setRewardEstimate(estimatedReward.toString());
    };
    estimateRewards();
  }, [tokenBet, gameData, winningTeam, success]);

  // update final winner
  useEffect(() => {
    // check if game is over
    if (gameStatus === GameStatus.AIRDROPPED) {
      setFinalWinner(
        gameData.team1.winner
          ? gameData.team1.teamName
          : gameData.team2.teamName
      );
    }
  }, [gameData, gameStatus]);

  return (
    <>
      {!loading && finalWinner === winningTeam && winAmount ? (
        <Confetti
          width={width}
          height={2 * height}
          recycle={false}
          numberOfPieces={400}
          tweenDuration={10000}
        />
      ) : null}
      <div className="relative overflow-hidden min-h-screen pb-48 lg:pb-10">
        {!loading ? (
          <>
            {/* Fixed y00ts pfps */}
            <div
              className={`lg:fixed absolute -bottom-2 -left-14 sm:left-0 z-10`}
            >
              <Image
                src={gameData.team1.nftImageUrl}
                width={250}
                height={250}
                alt="y00ts chiefs alt"
              />
            </div>
            <div
              className={`lg:fixed absolute -bottom-2 -right-14 sm:right-0 z-10`}
            >
              <Image
                src={gameData.team2.nftImageUrl}
                width={250}
                height={250}
                alt="y00ts eagles alt"
                style={
                  gameData.gameInfo.metadata?.length > 0
                    ? { transform: "scaleX(-1)" }
                    : {}
                }
              />
            </div>
          </>
        ) : null}
        {/* only when user is creator, show this banner */}
        {wagerUser !== null
          ? !loading &&
            wagerUser.publicKey === gameData.gameInfo.creator?.publicKey && (
              <AlertBanner2 />
            )
          : null}
        {!loading ? (
          <>
            <Navbar />
            <ViewToggle
              toggleConfig={toggleConfig}
              setToggleConfig={setToggleConfig}
              view="classic"
              ownsGame={
                wagerUser !== null &&
                wagerUser.publicKey === gameData.gameInfo.creator?.publicKey
              }
            />
          </>
        ) : null}

        {toggleConfig.selected === "option1" ? (
          <div
            className={`px-4 pt-16 flex flex-col gap-5 justify-between ${
              showModal && "overflow-hidden"
            }`}
          >
            {loading ? (
              // loading indicator
              <div className="w-fit mx-auto flex flex-col items-center mt-56">
                <BarLoader color="black" />
              </div>
            ) : null}

            {/* logo section */}
            {!loading && (
              <ClassicHero gameData={gameData} gameStatus={gameStatus} />
            )}

            {gameStatus === GameStatus.PREGAME && !loading && (
              <div className="text-center sm:text-lg">
                Live in: {pickCountdown}
              </div>
            )}
            {gameStatus !== GameStatus.PREGAME && !loading && (
              <div className={`${!publicKey && "mb-24 sm:mb-0"}`}>
                <RewardPool gameData={gameData} />
              </div>
            )}
            {!publicKey && !loading && (
              <div className="w-fit mx-auto text-center sm:mt-5 mb-20 sm:mb-32 md:mb-0">
                Connect wallet to play.
              </div>
            )}
            {/* second area / betting section */}
            {publicKey && !loading && (
              <div className="h-auto w-full relative overflow-hidden mb-20">
                {/* betting box */}
                <div className="bg-greyscale1 w-full md:w-[620px] mx-auto">
                  {/* header */}
                  {/* <div className="relative h-[50px] flex items-center justify-center bg-greyscale5">
                    <p className="font-base-b text-center text-greyscale1">
                      {`Make your pick`}
                    </p>
                  </div> */}
                  {/* betting = four components */}
                  <div className="flex flex-col justify-evenly items-center py-3 mx-5 md:mx-[60px]">
                    {/* 1. pick winner */}
                    <p className="text-left mr-auto pt-4 pb-2 sm:text-lg">
                      Pick a team
                    </p>

                    <ClassicVersusBox
                      gameData={gameData}
                      success={success}
                      handlePicks={pickHandler}
                      pickedTeams={[winningTeam]}
                      valid={gameStatus === GameStatus.OPEN}
                      gameStatus={gameStatus}
                      hideImage={gameData.gameInfo.league === "custom"}
                    />

                    {/* divider */}
                    <Divider />

                    {/* 2. throw some dust on it */}
                    <p className="text-left mr-auto py-2 sm:text-lg">
                      Throw down on it
                    </p>
                    <div className="w-full">
                      <form className="w-full relative">
                        <input
                          type="number"
                          disabled={
                            success || gameStatus !== GameStatus.OPEN || loading
                          }
                          min="1"
                          max="1000000"
                          value={tokenBet}
                          // TODO: fix decimal bug
                          onChange={(e) => {
                            setTokenBet(parseFloat(e.target.value ?? "0") ?? 0);
                          }}
                          className="disabled:opacity-70 disabled:cursor-not-allowed 
                          bg-greyscale2 hover:bg-greyscale3 px-2 h-[50px] w-full text-center focus:outline-none 
                          focus:ring-2 focus:ring-purple1 rounded-none focus:bg-greyscale1"
                        />
                        <div className="absolute left-2 top-[10px]">
                          <Image
                            src={getCurrencyIcon(gameData.gameInfo.token)}
                            height={30}
                            width={30}
                            alt={gameData.gameInfo.token ?? "dust"}
                          />
                        </div>
                      </form>
                      <div className="w-full pt-1 text-lg text-right">
                        Balance:{" "}
                        {Math.floor(Number(tokenBalance * 1000)) / 1000}{" "}
                        {gameData.gameInfo.token}
                      </div>
                    </div>

                    {finalWinner === undefined && (
                      <div className="w-full my-5 py-3 px-4 bg-greyscale3 text-center text-lg">
                        <div className="relative w-fit mx-auto">
                          <p>Potential payout</p>
                          <InfoIcon
                            className="w-4 h-4 absolute fill-purple1 hover:fill-purple2 top-1/2 -translate-y-[47%] -right-6 cursor-pointer"
                            onClick={() => setShowInfoModal(true)}
                          />
                        </div>
                        <div>
                          {rewardEstimate} {gameData.gameInfo.token}
                        </div>
                      </div>
                    )}

                    <Divider />
                    {/* TODO: replace with new component */}
                    <div
                      className={`my-2 w-fit mr-auto text-left text-lg ${
                        !success && "cursor-pointer disabled:cursor-default"
                      }`}
                      onClick={() =>
                        !success && !rulesDisabled && setAgree(!agree)
                      }
                    >
                      <input
                        type="checkbox"
                        checked={!!agree}
                        disabled={rulesDisabled}
                        onChange={() => setAgree(!agree)}
                        className="mr-2 accent-purple1 hover:accent-purple2"
                      />
                      You agree to{" "}
                      <span
                        className="text-purple1 hover:text-purple2 underline font-bold hover:cursor-pointer transition-all duration-150"
                        onClick={() => setShowModal(true)}
                      >
                        the rules
                      </span>
                      .
                    </div>

                    <Divider />

                    {/* 4. fuck it we ball - send dust */}
                    {!success &&
                    gameData?.gameInfo?.status !== "cancelled" &&
                    gameData?.gameInfo?.status !== "completed" ? (
                      <button
                        onClick={() => !buttonDisabled && handlePayToken()}
                        disabled={buttonDisabled}
                        className={`${
                          buttonDisabled
                            ? "cursor-not-allowed opacity-50"
                            : "cursor-pointer hover:bg-[#333333]"
                        }
                      bg-black text-greyscale1 w-full h-[50px] my-6 text-center z-[+1]`}
                      >
                        {buttonHandler()}
                      </button>
                    ) : (
                      <div className="bg-greyscale3 text-black text-lg w-full py-4 px-2 sm:px-0 my-6 text-center z-[+1]">
                        {!finalWinner &&
                        tokenBet &&
                        winningTeam &&
                        success &&
                        gameData?.gameInfo?.status !== "cancelled" ? (
                          // you picked a team, game in progress
                          <>
                            <p>{`Success! You picked ${winningTeam} with ${tokenBet} ${gameData.gameInfo.token}.`}</p>
                            <a
                              className="text-base underline text-purple1 hover:text-purple2"
                              href={`https://explorer.solana.com/tx/${txn}${
                                generalConfig.useDevNet ? "?cluster=devnet" : ""
                              }`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              See it on the blockchain
                            </a>
                          </>
                        ) : finalWinner === winningTeam && winAmount ? (
                          // you picked the winning team
                          <>
                            <p>{`LFG! You won ${winAmount} ${gameData.gameInfo.token}!`}</p>
                            <a
                              className="text-base underline text-purple1 hover:text-purple2"
                              href={`https://explorer.solana.com/tx/${airdropTxn}${
                                generalConfig.useDevNet ? "?cluster=devnet" : ""
                              }`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              See it on the blockchain
                            </a>
                          </>
                        ) : winningTeam &&
                          finalWinner !== winningTeam &&
                          gameData?.gameInfo?.status !== "cancelled" ? (
                          // you picked the incorrect team
                          <>
                            <p>
                              L<br />
                              ... we all take &apos;em
                            </p>
                          </>
                        ) : winningTeam &&
                          gameData?.gameInfo?.status === "cancelled" ? (
                          <>
                            <p>{`This game was refunded.`}</p>
                            <a
                              className={`text-base underline text-purple1 hover:text-purple2`}
                              href={`https://explorer.solana.com/tx/${airdropTxn}${
                                generalConfig.useDevNet ? "?cluster=devnet" : ""
                              }`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              See it on the blockchain
                            </a>
                          </>
                        ) : null}
                        {/* if we get here, user has not bet on this game */}
                        {winningTeam === undefined &&
                          gameData?.gameInfo?.status === "completed" && (
                            <p>
                              Game over!
                              <br />
                              Winners have been airdropped.
                            </p>
                          )}
                        {winningTeam === undefined &&
                          gameData?.gameInfo?.status === "cancelled" && (
                            <p>{`This game was refunded.`}</p>
                          )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : null}
        {toggleConfig.selected === "option2" ? (
          <ActivityFeed gameData={gameData} gameStatus={gameStatus} />
        ) : null}
        {toggleConfig.selected === "option3" ? (
          <ManageGame
            gameData={gameData}
            loadGameData={loadGameData}
            gameStatus={gameStatus}
          />
        ) : null}
      </div>
      <RulesModal showModal={showModal} setShowModal={setShowModal} />
      <InfoModal showModal={showInfoModal} setShowModal={setShowInfoModal}>
        <div
          className="w-full pt-4 text-center gap-5
          flex flex-col items-center justify-center"
        >
          <p className="text-xl sm:text-2xl font-base-b text-center">
            Your potential payout
          </p>
          <p className="max-w-[400px] mx-auto text-base sm:text-lg">
            Your payout is determined by the multiplier. Multipliers are highly
            volatile when the pool is live, and lock when the pool closes.
          </p>
          <button
            className="ml-auto text-purple1 hover:text-purple2 text-lg"
            onClick={() => setShowInfoModal(false)}
          >
            Close
          </button>
        </div>
      </InfoModal>
    </>
  );
};
export default Classic;
