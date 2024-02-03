import { FC, useContext, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  WagerUserContext,
  WagerUserContextType,
} from "../stores/WagerUserStore";
import Image from "next/image";
import { DeIDData } from "@/types/DeIDData";
import { generalConfig } from "@/configs";

const getUsernameFromDeID = (deid: DeIDData) => {
  return (
    deid.twitterHandle ||
    (deid.wallets?.length
      ? `${deid.wallets[0].address.slice(
          0,
          4
        )}...${deid.wallets[0].address.slice(-4)}`
      : null)
  );
};

const DeIDLoginButton: FC = () => {
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
        <button
          onClick={wagerUser?.deidData ? handleDeIDUnlink : handleDeIDLogin}
          className={`group bg-transparent border border-white text-sm text-white ${
            !!wagerUser?.deidData
              ? "hover:border-[#f14668] hover:bg-[#f14668] hover:text-white"
              : "hover:bg-greyscale1 hover:text-black"
          } h-[50px] flex justify-center items-center w-auto max-w-[200px]
          rounded-full px-5 py-2.5 gap-2 transition-all duration-300 font-figtree-semi`}
          style={{
            minWidth: "100px",
            borderWidth: "2px",
            borderRadius: "20px",
            padding: "10px 20px",
          }}
        >
          <p
            className={`text-lg leading-6 ${
              !!wagerUser?.deidData ? "hidden" : "inline"
            }`}
          >
            Connect
          </p>
          {wagerUser?.deidData && (
            <>
              <p className="text-lg leading-6 hidden group-hover:inline">
                Unlink
              </p>
              <p className="text-lg leading-6 inline group-hover:hidden truncate">
                {getUsernameFromDeID(wagerUser?.deidData!)}
              </p>
            </>
          )}
          <Image
            src="/images/icons/deid.svg"
            width={18}
            height={18}
            alt="deid icon"
            className="order-last"
          />
        </button>
      )}
    </>
  );
};

export default DeIDLoginButton;
