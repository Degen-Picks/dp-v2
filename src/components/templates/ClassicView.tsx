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
  GameMetadata,
  QuestionIcon,
  ClassicHero,
} from "@/components";
// solana wallet + utils
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import getDustBalance from "../../utils/getDustBalance";
import sendDustTransaction from "../../utils/sendDustTransaction";
import toast from "react-hot-toast";
import { generalConfig } from "@/configs";
import { getDateStr, getTimeStr, getDayTime } from "../../utils/dateUtil";
import { sleep } from "../../utils";
import { GameInfo, Wager } from "@/types";
import { ToggleConfig } from "../molecules/ViewToggle";
import {
  WagerUserContext,
  WagerUserContextType,
} from "../stores/WagerUserStore";

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
  const [dustBet, setDustBet] = useState<number>(33);
  const [dustBalance, setDustBalance] = useState<number>(0);
  const [isBroke, setIsBroke] = useState<boolean>(false);
  const [rewardEstimate, setRewardEstimate] = useState<number>(0);
  const [success, setSuccess] = useState<boolean>(false);
  const [txn, setTxn] = useState<string>();
  const [txnLoading, setTxnLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [agree, setAgree] = useState<boolean>(false);
  const [winAmount, setWinAmount] = useState<number>(0);
  const [airdropTxn, setAirdropTxn] = useState<string>();
  const [pickRefresh, setPickRefresh] = useState<boolean>(false);
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.PREGAME);

  const [utcPickDate, setUtcPickDate] = useState<number>(); // Date picks open
  const [utcGameDate, setUtcGameDate] = useState<number>(); // Date picks close

  const [finalWinner, setFinalWinner] = useState<string>();

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

  const pickFee = 0.069;

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
  const handlePayDust = async () => {
    if (!gameData || !publicKey) return;
    const toastId = toast.loading("Processing Transaction...");
    setTxnLoading(true);
    if (!isBroke) {
      const team = gameData.team1.teamName === winningTeam ? "team1" : "team2";
      const selectionId = gameData[team].id;
      const escrowPublicKey = gameData[team].publicKey;

      // Send dust to our wallet
      const txHash = await sendDustTransaction(
        publicKey,
        signTransaction,
        connection,
        dustBet,
        escrowPublicKey
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

      // TODO make sure same as init
      const parsed = {
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
    dustBet === undefined ||
    dustBet < 1 ||
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
      return "Insufficient DUST balance";
    } else if (
      !isBroke &&
      winningTeam &&
      (dustBet === null || dustBet < 1 || !rewardEstimate) &&
      gameStatus === GameStatus.OPEN
    ) {
      {
        /* not broke, picked a team, invalid dust bet */
      }
      return "Invalid DUST value";
    } else if (
      !isBroke &&
      winningTeam &&
      !agree &&
      dustBet !== null &&
      dustBet >= 1 &&
      gameStatus === GameStatus.OPEN
    ) {
      {
        /* not broke, picked a team, valid bet, checkbox unclicked */
      }
      return "Agree to the terms";
    } else if (
      !isBroke &&
      winningTeam &&
      dustBet !== null &&
      dustBet >= 1 &&
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
    const countdownLogic = () => {
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

    countdownLogic();
    const interval = setInterval(countdownLogic, 1000);

    return () => clearInterval(interval);
  };

  // same countdown logic as before but with picks opening
  const startPickDateCountdown = () => {
    const countdownLogic = async () => {
      // get today's date and time
      var now = new Date().getTime();

      // find the gameDistance between now and the count down date
      if (utcPickDate === undefined) return;
      var pickDistance = utcPickDate - now;

      // time calculations for days, hours, minutes and seconds (pick time - bets open)
      var days = Math.floor(pickDistance / (1000 * 60 * 60 * 24));
      var hours = Math.floor(
        (pickDistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      var minutes = Math.floor((pickDistance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((pickDistance % (1000 * 60)) / 1000);

      // display the result
      setPickCountdown(
        days + "d " + hours + "h " + minutes + "m " + seconds + "s "
      );

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
      }
    };

    countdownLogic();
    const interval = setInterval(countdownLogic, 1000);

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
      setLoading(false);
    }

    loadPick();
  }, []);

  // check if the user has enough dust each time the bet or wallet changes
  useEffect(() => {
    async function fetchWalletData() {
      if (publicKey) {
        const dustBalance = await getDustBalance(publicKey, connection);
        setDustBalance(dustBalance);

        // check if the user doesn't have enough DUST
        const userIsBroke = dustBet > dustBalance;
        // update state
        setIsBroke(userIsBroke);
      }
    }

    fetchWalletData();
  }, [publicKey, dustBet, connection]);

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

            setDustBet(userPickAmount.amount);

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

            console.log("THE TEAM YOU PICKED: ", gameData[pickedTeam].teamName);

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
      var teamVolume =
        gameData[winningTeam === gameData.team1.teamName ? "team1" : "team2"]
          .dustVol;

      var totalVol;
      // if user hasn't bet yet, factor in user bet in potential reward
      if (!success) {
        teamVolume = teamVolume + dustBet;
        totalVol = gameData.team1.dustVol + gameData.team2.dustVol + dustBet;
      } else {
        totalVol = gameData.team1.dustVol + gameData.team2.dustVol;
      }

      const multiplier = totalVol / teamVolume;
      let estimatedReward =
        Math.floor((dustBet - dustBet * pickFee) * multiplier * 100) / 100;

      if (!estimatedReward) {
        estimatedReward = totalVol;
      }

      setRewardEstimate(estimatedReward);
    };
    estimateRewards();
  }, [dustBet, gameData, winningTeam, success]);

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
      <div className="relative overflow-hidden min-h-screen pb-48 lg:pb-10">
        {!loading && (
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
        )}
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

        {toggleConfig.selected === "option1" && (
          <div
            className={`px-4 pt-16 flex flex-col justify-between ${
              showModal && "overflow-hidden"
            }`}
          >
            {loading && (
              // loading indicator
              <div className="w-fit mx-auto mt-20">
                {/* <div className="rotate">
                  <Image
                    src="/images/pickem/nipple.png"
                    width={100}
                    height={100}
                    alt="nipple spinner"
                  />
                </div> */}
                <p className="text-xl font-base text-center w-fit mx-auto py-10">
                  Loading ...
                </p>
              </div>
            )}

            {/* logo section */}
            {!loading && (
              <ClassicHero gameData={gameData} gameStatus={gameStatus} />
            )}

            {gameStatus === GameStatus.PREGAME && !loading && (
              <div className="text-center mt-8 sm:text-lg">
                Our next game opens for picks in: {pickCountdown}
              </div>
            )}
            {gameStatus !== GameStatus.PREGAME && !loading && (
              <div className={`${!publicKey && "mb-24 sm:mb-0"}`}>
                <RewardPool
                  gameData={gameData}
                  picksOpened={gameStatus === GameStatus.OPEN}
                  gameType={"degen"}
                />
              </div>
            )}
            {!publicKey && !loading && (
              <div className="w-fit mx-auto text-center sm:mt-5 mb-20 sm:mb-32 md:mt-5 md:mb-0">
                Connect wallet to play.
              </div>
            )}
            {publicKey && !loading && <div className="pb-8" />}
            {/* second area / betting section */}
            {publicKey && (
              <div className="z-10 h-auto w-full relative overflow-hidden">
                {/* betting box */}
                <div className="bg-white w-5/6 md:w-[620px] mx-auto">
                  {/* header */}
                  {/* <div className="relative h-[50px] flex items-center justify-center bg-container">
                    <p className="font-base-b text-center text-containerHead">
                      {`Make your pick`}
                    </p>
                  </div> */}
                  {/* betting = four components */}
                  <div className="flex flex-col justify-evenly items-center py-3 mx-8 md:mx-[60px]">
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
                      finalWinner={finalWinner}
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
                          value={dustBet}
                          onChange={(e) => {
                            setDustBet(parseFloat(e.target.value));
                          }}
                          className="disabled:opacity-70 disabled:cursor-not-allowed bg-light font-base-b 
                          rounded-md px-2 h-[50px] w-full text-center focus:outline-link focus:bg-white"
                        />
                        <div className="absolute left-2 top-[10px]">
                          <Image
                            src="/images/icons/dust_square2.png"
                            height={30}
                            width={30}
                            alt="dust icon"
                          />
                        </div>
                      </form>
                      <div className="w-full pt-1 text-sm sm:text-lg text-right text-secondary">
                        Balance: {Math.floor(Number(dustBalance * 1000)) / 1000}{" "}
                        DUST
                      </div>
                    </div>

                    {winningTeam !== undefined &&
                      finalWinner === undefined &&
                      dustBet >= 1 && (
                        <div className="w-full mt-4 py-3 px-4 bg-light text-center text-sm sm:text-base">
                          <p className="relative">
                            Potential reward (highly volatile)
                          </p>
                          {/* <div className="group absolute right-0 top-1/2 -translate-y-1/2">
                            <QuestionIcon fill="#651FFF" />
                            <div
                              className="z-50 absolute left-1/2 -translate-x-1/2 sm:bottom-1/2 sm:left-full sm:translate-x-0 ml-2 px-2 py-1 text-sm w-[200px] sm:w-[250px]
                              text-containerHead bg-container rounded-lg opacity-0 group-hover:opacity-100 
                              transition-opacity duration-500 ease-in-out pointer-events-none group-hover:pointer-events-auto"
                            >
                              Your reward is determined by the multiplier.
                              Multipliers are highly volatile when the pool is
                              live, and lock when the pool closes.
                            </div>
                          </div> */}
                          <div className="font-base-b">
                            {rewardEstimate || "N/A"} DUST
                          </div>
                        </div>
                      )}

                    <Divider />

                    <div
                      className={`my-2 w-fit mr-auto text-left text-sm sm:text-base ${
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
                        className="mr-2 accent-link hover:accent-linkHover"
                      />
                      You agree to{" "}
                      <span
                        className="text-link hover:text-linkHover underline font-bold hover:cursor-pointer transition-all duration-150"
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
                        onClick={() => !buttonDisabled && handlePayDust()}
                        disabled={buttonDisabled}
                        className={`${
                          buttonDisabled
                            ? "cursor-not-allowed opacity-50"
                            : "cursor-pointer hover:bg-[#333333]"
                        }
                      bg-black text-white w-full py-4 my-6 text-center z-[+1]`}
                      >
                        {buttonHandler()}
                      </button>
                    ) : (
                      <div className="bg-light text-black text-sm sm:text-base w-full py-4 px-2 sm:px-0 my-6 text-center z-[+1]">
                        {!finalWinner &&
                        dustBet &&
                        winningTeam &&
                        success &&
                        gameData?.gameInfo?.status !== "cancelled" ? (
                          // you picked a team, game in progress
                          <>
                            <p className="font-base-b">{`Success! You picked ${winningTeam} with ${dustBet} DUST.`}</p>
                            <a
                              className="text-base underline text-link hover:text-linkHover"
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
                            <p className="font-base-b">{`LFG! You won ${winAmount} DUST!`}</p>
                            <a
                              className="text-base underline text-link hover:text-linkHover"
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
                            <p className="font-base-b">L</p>
                            <p>... we all take &apos;em</p>
                          </>
                        ) : winningTeam &&
                          gameData?.gameInfo?.status === "cancelled" ? (
                          <>
                            <p className="font-base-b">{`This game was refunded.`}</p>
                            <a
                              className={`text-base underline text-link hover:text-linkHover`}
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
                            <p className="font-base-b">{`Game over! Winners have been airdropped.`}</p>
                          )}
                        {winningTeam === undefined &&
                          gameData?.gameInfo?.status === "cancelled" && (
                            <p className="font-base-b">{`This game was refunded.`}</p>
                          )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {toggleConfig.selected === "option2" && (
          <ActivityFeed gameData={gameData} gameStatus={gameStatus} />
        )}
        {toggleConfig.selected === "option3" && (
          <ManageGame
            gameData={gameData}
            loadGameData={loadGameData}
            gameStatus={gameStatus}
          />
        )}
      </div>
      {/* modal window - legal jargon */}
      <RulesModal showModal={showModal} setShowModal={setShowModal} />
    </>
  );
};
export default Classic;
