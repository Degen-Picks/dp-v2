import { FC, useContext, useEffect, useState } from "react";
import Image from "next/image";
import { Selection, Wager } from "@/types";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import toast from "react-hot-toast";
import sendTransaction from "@/utils/sendTransaction";
import { generalConfig } from "@/configs";
import { getCurrencyIcon, getTokenBalance, handleConfirmAction, pickFee, refundClassic, sleep } from "@/utils";
import { GameStatus } from "../templates/ClassicView";
import { TOKEN_MAP } from "@/types/Token";
import { InfoIcon } from "lucide-react";
import { WagerUserContext, WagerUserContextType } from "../stores/WagerUserStore";
import { airdropClassic } from "@/utils/api/classic/airdrop";

interface Props {
  data: Wager;
  loadGameData: () => void;
}

const SelectedGameData: FC<Props> = ({ data, loadGameData }) => {
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();

  const [tokenBet, setTokenBet] = useState<string | null>("33");
  const [multiplier, setMultiplier] = useState({
    team1: "1.0x",
    team2: "1.0x",
  });
  const [txnLoading, setTxnLoading] = useState(false);
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [isBroke, setIsBroke] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Selection | null>(null);
  const [txn, setTxn] = useState("");
  const [success, setSuccess] = useState(false);
  const [agree, setAgree] = useState(true); // TODO: I dont think we have terms anymore? Seting default to true
  const [minimumBet, setMinimumBet] = useState(0.1);
  const [rewardEstimate, setRewardEstimate] = useState<string>("--");
  const [mode, setMode] = useState('play');
  const { wagerUser } = useContext(WagerUserContext) as WagerUserContextType;
  const [isAdmin, setIsAdmin] = useState(false);
  const wallet = useWallet();

  useEffect(() => {
    if ((wagerUser && wagerUser.roles.includes("ADMIN"))) {
      setIsAdmin(true);
    } else {

      setIsAdmin(false);
    }
  }, [wagerUser]);

  const buttonDisabled =
    !publicKey ||
    isBroke ||
    selectedTeam === null ||
    tokenBet === undefined ||
    tokenBet === null ||
    parseFloat(tokenBet) < minimumBet ||
    agree === false ||
    txnLoading ||
    data.status !== GameStatus.OPEN;

  const handlePayToken = async () => {
    if (!data || !publicKey || tokenBet === null) return;
    const toastId = toast.loading("Processing Transaction...");
    setTxnLoading(true);
    if (!isBroke && selectedTeam) {
      const selectionId = selectedTeam._id;
      const escrowPublicKey = selectedTeam.publicKey;

      // Send dust to our wallet
      const txHash = await sendTransaction(
        publicKey,
        signTransaction,
        connection,
        parseFloat(tokenBet),
        escrowPublicKey,
        data.token!
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
    if (!data || !publicKey) return;
    try {
      const headers = new Headers();
      headers.append("Content-Type", "application/json");

      const requestOptions = {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          wagerId: data._id,
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

  const valueHandler = () => {
    if (tokenBet === null) return "";
    if (success) {
      if (Number.isInteger(parseFloat(tokenBet))) {
        return tokenBet;
      } else {
        return parseFloat(tokenBet).toFixed(2);
      }
    } else {
      return tokenBet;
    }
  };

  const handleBetInput = (e: any) => {
    const inputValue: string = e.target.value;

    if (/^\d*\.?\d*$/.test(inputValue)) {
      setTokenBet(inputValue);
    }
  };

  // updates button text based current state
  const buttonHandler = () => {
    if (!publicKey && data.status === GameStatus.OPEN) {
      {
        /* game is open but wallet not connected */
      }
      return `Connect your wallet`;
    } else if (
      data.status !== GameStatus.OPEN &&
      !success &&
      data.status !== GameStatus.PREGAME
    ) {
      {
        /* betting is over and you didn't pick */
      }
      return "Picks closed";
    } else if (data.status === GameStatus.PREGAME) {
      // game just created, waiting to start...
      return "Picks open soon...";
    } else if (selectedTeam === null && data.status === GameStatus.OPEN) {
      {
        /* forgot to pick a winning team */
      }
      return "Select a winning team";
    } else if (isBroke && !!selectedTeam && data.status === GameStatus.OPEN) {
      {
        /* broke but picked a team */
      }
      return `Insufficient ${data.token} balance`;
    } else if (
      !isBroke &&
      !!selectedTeam &&
      (tokenBet === null || rewardEstimate === "--") &&
      data.status === GameStatus.OPEN
    ) {
      {
        /* not broke, picked a team, invalid dust bet */
      }
      return `Invalid ${data.token} value`;
    } else if (
      !isBroke &&
      !!selectedTeam &&
      !agree &&
      tokenBet !== null &&
      parseFloat(tokenBet) >= minimumBet &&
      data.status === GameStatus.OPEN
    ) {
      {
        /* not broke, picked a team, valid bet, checkbox unclicked */
      }
      return "Agree to the terms";
    } else if (
      !isBroke &&
      !!selectedTeam &&
      tokenBet !== null &&
      parseFloat(tokenBet) >= minimumBet &&
      agree &&
      data.status === GameStatus.OPEN
    ) {
      {
        /* not broke, picked a team, valid dust bet */
      }
      return "F*ck it, we ball";
    }

    // return "Waiting for game to open";
  };

  // const pickHandler = (teamNum: number) => {
  //   if (teamNum === 1) {
  //     setWinningTeam(
  //       winningTeam === gameData.team1.teamName
  //         ? undefined
  //         : gameData.team1.teamName
  //     );
  //   } else {
  //     setWinningTeam(
  //       winningTeam === gameData.team2.teamName
  //         ? undefined
  //         : gameData.team2.teamName
  //     );
  //   }
  // };

  useEffect(() => {
    if (!data.selections) return;
    const team1Multiplier =
      Math.floor(
        ((data.selections[0].totalSpent + data.selections[1].totalSpent) /
          data.selections[0].totalSpent) *
          100
      ) / 100;

    const team2Multiplier =
      Math.floor(
        ((data.selections[0].totalSpent + data.selections[1].totalSpent) /
          data.selections[1].totalSpent) *
          100
      ) / 100;

    const team1MultiplierParsed =
      team1Multiplier === Infinity ? "-" : `${team1Multiplier}x`;
    const team2MultiplierParsed =
      team2Multiplier === Infinity ? "-" : `${team2Multiplier}x`;

    if (!Number.isNaN(team1Multiplier) && !Number.isNaN(team1Multiplier)) {
      setMultiplier({
        team1: team1MultiplierParsed,
        team2: team2MultiplierParsed,
      });
    }
  }, [data.selections]);

  useEffect(() => {
    if (!data.token) return;
    if (data.token === "SOL") {
      setMinimumBet(0.1);
    } else {
      setMinimumBet(TOKEN_MAP[data.token!].minimum);
    }
  }, [data.token]);

  // update reward predictions each time we change pick, dust wager, or incoming game data changes
  useEffect(() => {
    const estimateRewards = () => {
      if (
        selectedTeam === null ||
        tokenBet === null ||
        parseFloat(tokenBet) < minimumBet ||
        parseFloat(tokenBet) === 0 ||
        Number.isNaN(tokenBet)
      ) {
        setRewardEstimate("--");
        return;
      }

      var teamVolume = data.selections.find(
        (o) => o._id === selectedTeam?._id
      )?.totalSpent;

      if (teamVolume === undefined) {
        teamVolume = 0;
      }

      var totalVol;
      // if user hasn't bet yet, factor in user bet in potential reward
      if (!success && teamVolume) {
        teamVolume = teamVolume + parseFloat(tokenBet);
        totalVol =
          data.selections[0].totalSpent +
          data.selections[1].totalSpent +
          parseFloat(tokenBet);
      } else {
        totalVol =
          data.selections[0].totalSpent + data.selections[1].totalSpent;
      }

      const multiplier = totalVol / teamVolume;
      let estimatedReward =
        Math.floor(
          (parseFloat(tokenBet) - parseFloat(tokenBet) * pickFee) *
            multiplier *
            100
        ) / 100;

      if (!estimatedReward) {
        estimatedReward = totalVol;
      }

      setRewardEstimate(estimatedReward.toString());
    };
    estimateRewards();
  }, [tokenBet, data, selectedTeam, success, minimumBet]);

  // check if the user has enough token each time the bet or wallet changes
  useEffect(() => {
    async function fetchWalletData() {
      if (publicKey && data.token) {
        const balance = await getTokenBalance(
          publicKey,
          connection,
          data.token
        );
        setTokenBalance(balance);

        // check if the user doesn't have enough token
        if (data.token === "SOL" && tokenBet !== null) {
          setIsBroke(parseFloat(tokenBet) + 0.01 > balance);
        } else {
          setIsBroke(tokenBet !== null && parseFloat(tokenBet) > balance);
        }
      }
    }

    fetchWalletData();
  }, [publicKey, tokenBet, connection, data.token]);

  const handleCancelGame = async () => {
    if (wagerUser?.roles?.includes("ADMIN")) {
      const confirmation = await handleConfirmAction(
        wallet,
        "Are you sure you want to cancel this game?"
      );
      if (!confirmation) return;

      const toastId = toast.loading("Cancelling game...");

      const { success, message } = await refundClassic(data._id);

      success === true
        ? toast.success("Game cancelled!")
        : toast.error(message);

      // Refresh game data
      loadGameData();

      toast.dismiss(toastId);
    }
  };

  const handleAirDrop = async () => {
    if (!selectedTeam) {
      toast.error("Please select a winner first!");
      return;
    }

    if (data.status !== GameStatus.CLOSED) {
      toast.error("Game must be closed to airdrop winners!");
      return;
    }

    const confirmation = await handleConfirmAction(
      wallet,
      `Are you sure you want to declare ${selectedTeam?.title} as the winner?`
    );
    if (!confirmation) return;

    const toastId = toast.loading("Declaring winner...");

    const { success, message } = await airdropClassic(data._id, selectedTeam?._id);

    success === true
      ? toast.success("Winner declared and initiated airdrop!")
      : toast.error(message);

    // Refresh game data
    loadGameData();

    toast.dismiss(toastId);
  };

  return (
    <div className="flex flex-col gap-4">
      {isAdmin && (
        <div className="w-full mb-4">
          <div className="flex rounded-[10px] bg-greyscale6 p-0.5">
            <button
              className={`flex-1 py-2 px-4 rounded-[8px] text-sm ${
                mode === 'play' ? 'bg-greyscale1 text-black' : 'text-greyscale1'
              }`}
              onClick={() => setMode('play')}
            >
              Play
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-[8px] text-sm ${
                mode === 'manage' ? 'bg-greyscale1 text-black' : 'text-greyscale1'
              }`}
              onClick={() => setMode('manage')}
            >
              Manage
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2.5 justify-center">
        <p className="text-greyscale1 text-[18px] font-base-b pr-10">
          {data.title}
        </p>
        {data.description && (
          <p className="text-greyscale4 text-xs">{data.description}</p>
        )}
      </div>

      <div className="flex flex-col gap-2.5">
        <p className="text-greyscale4 text-xs">{mode === 'manage' ? 'Winner' : 'Pick'}</p>
        <div className="w-full flex gap-0.5 text-greyscale1">
          {data.selections?.map((o, index) => (
            <button
              key={o._id}
              disabled={mode === 'play' && (!publicKey || data.status !== GameStatus.OPEN)}
              className={`flex flex-col items-center border gap-[5px] p-2.5 w-full h-full rounded-[10px] disabled:cursor-not-allowed ${
                index < 1 && "rounded-r-none"
              } ${index > 0 && "rounded-l-none"} ${
                selectedTeam?._id === o._id
                  ? "bg-greyscale6 border-data"
                  : "bg-greyscale6 hover:bg-greyscale1/10 disabled:hover:bg-greyscale6 border-transparent"
              }`}
              onClick={() => setSelectedTeam(o)}
            >
              <p className="text-sm">{o.title}</p>
              {mode === 'play' && (
                <p className="text-xs text-greyscale4">
                  {index === 0 ? '1.67x' : '3.33x'}
                </p>
              )}
            </button>
          ))}
        </div>
      </div>

      {mode === 'play' && (
        <>
          <div className="flex flex-col gap-2.5">
            <p className="text-greyscale4 text-xs">Amount</p>
            <form className="w-full relative">
              <input
                type="text"
                inputMode="decimal"
                disabled={!publicKey || data.status !== GameStatus.OPEN}
                value={tokenBet === null ? "" : tokenBet}
                onChange={(e) => setTokenBet(e.target.value)}
                className="disabled:opacity-70 disabled:cursor-not-allowed rounded-[10px]
                  bg-greyscale6 hover:bg-greyscale1/10 disabled:hover:bg-greyscale6 p-[10px] w-full 
                  text-center focus:outline-none focus:ring-2 focus:ring-data focus:bg-greyscale1/10"
              />
              <div className="absolute left-2 top-2.5">
                <Image
                  src={getCurrencyIcon(data.token)}
                  height={30}
                  width={30}
                  alt="currency"
                />
              </div>
            </form>
            <div className="w-full text-center text-sm">
              <div className="relative w-fit mx-auto">
                <p className="text-greyscale4">{`Potential payout: ${rewardEstimate} ${data.token}`}</p>
              </div>
            </div>
          </div>

          <div className="w-full text-xs text-[#919DF8] rounded-[10px] py-2.5 px-[15px] bg-greyscale6 flex items-center gap-[15px]">
            <Image
              src="/images/icons/new/warn.png"
              height={14}
              width={14}
              alt="warning"
            />
            <p className="flex flex-1">
              Your potential payout can change, and is determined by the
              multiplier when the pool closes.
            </p>
          </div>

          <button
            className="w-full p-2.5 bg-data text-black rounded-[10px] text-sm disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={buttonDisabled}
            onClick={handlePayToken}
          >
            {buttonHandler()}
          </button>
        </>
      )}

      {mode === 'manage' && (
        <>
          <button
            className="w-full p-2.5 bg-data text-black rounded-[10px] text-sm"
            onClick={handleAirDrop}
          >
            Airdrop winners
          </button>
          <button
            className="w-full text-center text-red-500 text-sm"
            onClick={handleCancelGame}
          >
            Cancel pool
          </button>
        </>
      )}
    </div>
  );
};

export default SelectedGameData;
