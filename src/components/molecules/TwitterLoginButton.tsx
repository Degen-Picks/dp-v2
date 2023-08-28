import { generalConfig } from "@/configs";
import { useWallet } from "@solana/wallet-adapter-react";
import { useState, useEffect, FC } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { FallbackImage } from "@/components";
import { WagerUser } from "@/types";

const TwitterLoginButton: FC = () => {
  const { publicKey } = useWallet();
  const [userData, setUserData] = useState<WagerUser | null>();
  const [isTwitterLinked, setIsTwitterLinked] = useState<boolean>(false);

  const wallet = useWallet();

  const loadUserData = async () => {
    try {
      const url = `${generalConfig.apiUrl}/oauth/status?publicKey=${publicKey}`;

      const res = await fetch(url);

      if (res.status === 404) {
        return;
      }

      const data: WagerUser = await res.json();

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
              ? "sm:hover:border-[#E1233D] sm:hover:border-2 sm:py-2"
              : "sm:py-1 sm:border border-black bg-white"
          } h-[50px] w-[50px] sm:min-w-[146px] flex justify-center 
          rounded-full sm:rounded-none items-center sm:gap-2 group`}
        >
          {!isTwitterLinked || !userData ? (
            <div className="flex items-center justify-center gap-2.5 px-2">
              <Image
                src="/images/icons/x.png"
                width={30}
                height={30}
                alt="twitter icon"
              />
              <p className="text-lg">Link</p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-center gap-2.5 sm:px-2 sm:group-hover:hidden">
                <div
                  className="border border-light flex items-center justify-center rounded-full 
                  w-[30px] h-[30px] overflow-hidden"
                >
                  <FallbackImage
                    src={userData?.twitterData!.profileImage}
                    fallbackSrc={"/images/icons/user-alt.png"}
                    width={30}
                    height={30}
                    alt="Twitter Profile Image"
                  />
                </div>
                <p className="text-lg">{userData?.twitterData!.username}</p>
              </div>
              <div className="hidden sm:group-hover:block">
                <p className="text-[#E1233D]">Unlink Twitter/X</p>
              </div>
            </div>
          )}
        </button>
      )}
    </>
  );
};

export default TwitterLoginButton;
