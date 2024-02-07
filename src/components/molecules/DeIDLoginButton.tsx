import { FC, useContext } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  WagerUserContext,
  WagerUserContextType,
} from "../stores/WagerUserStore";
import Image from "next/image";
import { generalConfig } from "@/configs";
import { Trash } from "lucide-react";
import { getUsernameFromDeID } from "@/utils";

interface Props {
  type?: "modal" | "nav";
  full?: boolean;
}

const DeIDLoginButton: FC<Props> = ({ type = "nav", full = false }) => {
  const { publicKey } = useWallet();
  const { wagerUser, setWagerUser } = useContext(
    WagerUserContext
  ) as WagerUserContextType;
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

  async function sendDeIDLogout() {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const requestOptions: RequestInit = {
      method: "POST",
      headers: headers,
      credentials: "include",
    };

    const response = await fetch(
      `${generalConfig.apiUrl}/oauth/logout/deid`,
      requestOptions
    );
    const body = await response.json();
    return body;
  }

  const handleDeIDLogin = async () => {
    try {
      if (!wallet.signMessage) {
        // toast.error("Sign message not supported.");
        return;
      }

      if (!publicKey) {
        // toast.error("Wallet not connected.");
        return;
      }

      // Confirm wallet ownership
      const nonce = generalConfig.WALLET_SIGN_MESSAGE_LOGIN;
      if (nonce.length <= 0) return;

      const tx = await wallet.signMessage(Buffer.from(nonce));

      const { verified } = await confirmSignature(
        publicKey.toString(),
        Buffer.from(tx).toString("hex"),
        "true"
      );

      if (!verified) {
        // toast.error("Could not verify wallet.");
        return;
      }

      const url = `${generalConfig.apiUrl}/oauth/login/deid`;
      window.open(url, "_self");
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeIDUnlink = async () => {
    try {
      // Confirm wallet ownership
      const nonce = generalConfig.WALLET_SIGN_MESSAGE_LOGOUT;
      if (nonce.length <= 0) return;

      if (!wallet.signMessage) {
        // toast.error("Sign message not supported.");
        return;
      }

      if (!publicKey) {
        // toast.error("Wallet not connected.");
        return;
      }

      const tx = await wallet.signMessage(Buffer.from(nonce));

      // TODO: DEPRECATE CONFIRM SIGNATURE, MOVE TO LOGIN
      const { verified } = await confirmSignature(
        publicKey.toString(),
        Buffer.from(tx).toString("hex"),
        "false"
      );

      if (!verified) {
        // toast.error("Could not verify wallet.");
        return;
      }

      const logoutStatus = await sendDeIDLogout();
      console.log("logout status", logoutStatus);
      if (!logoutStatus.success) {
        // toast.error("Could not unlink twitter.");
        return;
      }

      if (wagerUser) {
        wagerUser.deidData = null;
        setWagerUser({ ...wagerUser });
      }

      // toast.success("Twitter unlinked.");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {publicKey && (
        <div className={`${!wagerUser?.deidData && "button-wrapper"} w-full`}>
          <button
            onClick={wagerUser?.deidData ? handleDeIDUnlink : handleDeIDLogin}
            className={`group bg-black border text-white ${
              !!wagerUser?.deidData
                ? "hover:border-[#f14668] border-foregroundDark"
                : type === "modal"
                ? "border-white"
                : "border-transparent"
            } h-[50px] flex ${
              !wagerUser?.deidData ? "flex-row" : "flex-row-reverse"
            } justify-center items-center ${
              full ? "w-full" : "w-auto max-w-[200px]"
            }
            rounded-full px-5 py-2.5 gap-2 font-figtree`}
            style={{
              minWidth: "100px",
              borderWidth: "2px",
              borderRadius: "20px",
              padding: "10px 20px",
            }}
          >
            <p
              className={`leading-6 ${
                !!wagerUser?.deidData ? "hidden" : "inline"
              }`}
            >
              Connect
            </p>
            {wagerUser?.deidData && (
              <p className="leading-6 inline truncate">
                {getUsernameFromDeID(wagerUser?.deidData!)}
              </p>
            )}
            <Image
              src="/images/icons/deid.svg"
              width={18}
              height={18}
              alt="deid icon"
              className={`${!!wagerUser?.deidData && "group-hover:hidden"}`}
            />
            <Trash
              size={18}
              fill="#FF6B6B"
              color="#FF6B6B"
              className={`hidden ${
                !!wagerUser?.deidData && "group-hover:block"
              }`}
            />
          </button>
        </div>
      )}
    </>
  );
};

export default DeIDLoginButton;
