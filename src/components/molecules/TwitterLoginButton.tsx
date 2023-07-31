import { generalConfig } from "@/configs";
import { useWallet } from "@solana/wallet-adapter-react";
import { useState, useEffect, FC } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { FallbackImage, Twitter } from "@/components";
import { TwitterObject } from "@/types";

const TwitterLoginButton: FC = () => {
  const { publicKey } = useWallet();
  const [userData, setUserData] = useState<TwitterObject | null>();
  const [isTwitterLinked, setIsTwitterLinked] = useState<boolean>(false);

  const wallet = useWallet();

  const loadUserData = async () => {
    try {
      const url = `${generalConfig.apiUrl}/oauth/status?publicKey=${publicKey}`;

      const res = await fetch(url);

      if (res.status === 404) {
        return;
      }

      const data: TwitterObject = await res.json();

      setUserData(data || {});

      if (data.twitterData && data.twitterData !== null) {
        setIsTwitterLinked(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

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

      if (!publicKey) {
        toast.error("Wallet not connected.");
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

      if (!publicKey) {
        toast.error("Wallet not connected.");
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
        toast.error("Could not verify wallet.");
        return;
      }

      const logoutStatus = await sendTwitterLogout();
      if (!logoutStatus.success) {
        toast.error("Could not unlink twitter.");
        return;
      }

      toast.success("Twitter unlinked.");

      setIsTwitterLinked(false);
      setUserData(null);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (publicKey) {
      loadUserData();
    }
  }, [publicKey]);

  return (
    <>
      {publicKey && (
        <button
          onClick={isTwitterLinked ? handleTwitterUnlink : handleTwitterLogin}
          className={`${
            isTwitterLinked
              ? "bg-white text-black font-base-b sm:hover:border-[#E1233D] sm:py-2"
              : "bg-light sm:bg-[#53A8E7] text-white sm:py-1"
          } h-[50px] w-[50px] sm:min-w-[146px] flex justify-center 
          rounded-full sm:rounded-none items-center sm:gap-2 sm:border-2 sm:border-transparent group`}
        >
          {!isTwitterLinked || !userData ? (
            <>
              <div className="hidden sm:flex items-center justify-center gap-2 px-2">
                <Twitter className="fill-white w-4" />
                <p>Link Twitter</p>
              </div>

              <div className="sm:hidden h-full flex items-center">
                <Image
                  src="/images/icons/user.svg"
                  width={20}
                  height={20}
                  alt="user icon"
                />
              </div>
            </>
          ) : (
            <div>
              <div className="sm:hidden flex items-center justify-center">
                <div className="border border-light flex items-center justify-center rounded-full w-[50px] h-[50px] overflow-hidden">
                  <FallbackImage
                    src={userData?.twitterData.profileImage}
                    fallbackSrc={"/images/icons/user-alt.svg"}
                    width={50}
                    height={50}
                    alt="Twitter Profile Image"
                  />
                </div>
              </div>
              <div className="hidden sm:flex items-center justify-center gap-2 sm:px-2 sm:group-hover:hidden">
                <div className="border border-light flex items-center justify-center rounded-full w-[35px] h-[35px] overflow-hidden">
                  <FallbackImage
                    src={userData?.twitterData.profileImage}
                    fallbackSrc={"/images/icons/user-alt.svg"}
                    width={35}
                    height={35}
                    alt="Twitter Profile Image"
                  />
                </div>
                <p className="font-base-b">{userData?.twitterData.username}</p>
              </div>
              <div className="hidden sm:group-hover:block">
                <p className="text-[#E1233D]">Unlink Twitter</p>
              </div>
            </div>
          )}
        </button>
      )}
    </>
  );
};

export default TwitterLoginButton;
