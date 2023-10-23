import { FC, useContext, useRef } from "react";
import { X, ExternalLink, UserIcon, Link } from "lucide-react";
import { useOutsideAlerter } from "@/hooks/useOutsideAlerter";
import { useRouter } from "next/router";
import { Divider, FallbackImage } from "@/components";
import { useWallet } from "@solana/wallet-adapter-react";
import { WagerUser } from "@/types";
import { generalConfig } from "@/configs";
import toast from "react-hot-toast";
import {
  WagerUserContext,
  WagerUserContextType,
} from "../stores/WagerUserStore";

interface Props {
  setIsOpen: (open: boolean) => void;
  userData: WagerUser | undefined;
  setUserData: (user: WagerUser | undefined) => void;
}

const MegaMenu: FC<Props> = ({ setIsOpen, userData, setUserData }) => {
  const { wagerUser, setWagerUser } = useContext(
    WagerUserContext
  ) as WagerUserContextType;

  const router = useRouter();
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, () => setIsOpen(false));

  const wallet = useWallet();

  const confirmSignature = async (
    publicKey: string,
    signedMessage: string,
    isLogin: string
  ) => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const requestOptions: RequestInit = {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ publicKey, signedMessage, isLogin }),
      credentials: "include",
    };

    const response = await fetch(
      `${generalConfig.apiUrl}/api/confirmWallet`,
      requestOptions
    );
    const body = await response.json();
    return body;
  };

  async function sendTwitterLogout() {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const requestOptions: RequestInit = {
      method: "POST",
      headers: headers,
      credentials: "include",
    };

    const response = await fetch(
      `${generalConfig.apiUrl}/oauth/logout/twitter`,
      requestOptions
    );
    const body = await response.json();
    return body;
  }

  const handleTwitterLogin = async () => {
    try {
      if (!wallet.signMessage) {
        toast.error("Sign message not supported.");
        return;
      }

      if (!wallet.publicKey) {
        toast.error("Wallet not connected.");
        return;
      }

      // Confirm wallet ownership
      const nonce = generalConfig.WALLET_SIGN_MESSAGE_LOGIN;
      if (nonce.length <= 0) return;

      const tx = await wallet.signMessage(Buffer.from(nonce));

      const { verified } = await confirmSignature(
        wallet.publicKey.toString(),
        Buffer.from(tx).toString("hex"),
        "true"
      );

      if (!verified) {
        toast.error("Could not verify wallet.");
        return;
      }

      const url = `${generalConfig.apiUrl}/oauth/login/twitter`;
      window.open(url, "_self");
    } catch (err) {
      console.log(err);
    }
  };

  const handleTwitterUnlink = async () => {
    try {
      // Confirm wallet ownership
      const nonce = generalConfig.WALLET_SIGN_MESSAGE_LOGOUT;
      if (nonce.length <= 0) return;

      if (!wallet.signMessage) {
        toast.error("Sign message not supported.");
        return;
      }

      if (!wallet.publicKey) {
        toast.error("Wallet not connected.");
        return;
      }

      const tx = await wallet.signMessage(Buffer.from(nonce));

      // TODO: DEPRECATE CONFIRM SIGNATURE, MOVE TO LOGIN
      const { verified } = await confirmSignature(
        wallet.publicKey.toString(),
        Buffer.from(tx).toString("hex"),
        "false"
      );

      if (!verified) {
        toast.error("Could not verify wallet.");
        return;
      }

      const logoutStatus = await sendTwitterLogout();
      if (!logoutStatus.success) {
        toast.error("Could not unlink twitter.");
        return;
      }

      if (wagerUser) {
        wagerUser.twitterData = null;
        setWagerUser(wagerUser);
      }

      toast.success("Twitter unlinked.");

      setUserData(undefined);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="absolute top-[86px] right-10 z-50">
      <div className="relative w-full sm:w-[300px]" ref={wrapperRef}>
        <div className="relative flex flex-col w-full bg-greyscale1">
          {/* header */}
          <div className="w-full">
            <button
              className="absolute right-3 top-3"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              <X color="black" size={20} />
            </button>
          </div>
          {wallet.publicKey && (
            <div className="flex flex-col items-start">
              <div className="flex items-start gap-2.5 p-5">
                {!userData?.twitterData ? (
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full border border-greyscale4">
                      <UserIcon color="#A89FA8" />
                    </div>
                    <p className={`text-lg whitespace-nowrap`}>
                      {wallet.publicKey.toBase58().slice(0, 4) +
                        " ... " +
                        wallet.publicKey.toBase58().slice(-4)}
                    </p>
                    <button
                      className="h-6 px-[5px] border border-purple1 flex items-center justify-center 
                      gap-[5px] fill-purple1 hover:fill-purple2 text-purple1 hover:text-purple2"
                      onClick={() => handleTwitterLogin()}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height={12}
                        width={12}
                        viewBox="0 0 512 512"
                      >
                        <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
                      </svg>
                      <p className="text-base">link</p>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5">
                    <FallbackImage
                      src={userData?.twitterData!.profileImage}
                      fallbackSrc={"/images/icons/user-alt.png"}
                      width={33}
                      height={33}
                      alt="Twitter Profile Image"
                    />
                    <div className="flex flex-col gap-1 items-start">
                      <p className="text-lg leading-4">
                        {userData?.twitterData!.username}
                      </p>
                      <p className={`text-base leading-4 whitespace-nowrap`}>
                        {wallet.publicKey.toBase58().slice(0, 4) +
                          " ... " +
                          wallet.publicKey.toBase58().slice(-4)}
                      </p>
                    </div>
                    <button
                      className="border border-greyscale3 w-[30px] h-[30px] flex items-center justify-center"
                      onClick={() => handleTwitterUnlink()}
                    >
                      <Link color="#A89FA8" />
                    </button>
                  </div>
                )}
              </div>
              <Divider margin="0px" />
            </div>
          )}
          <div className="flex flex-col items-start gap-5 p-5">
            <a className="text-lg w-fit" href={generalConfig.appUrl}>
              Games
            </a>
            <button
              className="text-lg w-fit"
              onClick={() => router.push("/leaderboard")}
            >
              Leaderboard
            </button>
            <div className="flex items-center gap-1.5">
              <button
                className="text-lg w-fit"
                onClick={() => router.push("/gamesetup")}
              >
                Create a Pool
              </button>
              <div className="flex items-center justify-center text-base bg-data text-black px-1">
                Get 50% of the fees
              </div>
            </div>
          </div>
          <Divider margin="0px" />
          <button
            className="flex items-center gap-2.5 w-fit p-5"
            onClick={() => router.push("/")}
          >
            <p className="text-lg">Degen Picks Handbook</p>
            <ExternalLink size={20} color="#A89FA8" />
          </button>
          {wallet.publicKey && (
            <>
              <Divider margin="0px" />
              <button
                className="flex items-start w-fit text-lg p-5"
                onClick={() => {
                  wallet.disconnect();
                  setIsOpen(false);
                }}
              >
                <p className="text-lg">Sign out</p>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
