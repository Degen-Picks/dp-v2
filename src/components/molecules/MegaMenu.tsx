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
    <div className="fixed w-full right-0 top-0 sm:w-auto sm:absolute sm:top-[10px] sm:right-0 z-50 shadow-lg">
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
                      <a
                        href={`https://twitter.com/${userData.twitterData.username}`}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-lg leading-4 hover:text-purple1"
                      >
                        {userData?.twitterData!.username}
                      </a>
                      <p className={`text-base leading-4 whitespace-nowrap`}>
                        {wallet.publicKey.toBase58().slice(0, 4) +
                          " ... " +
                          wallet.publicKey.toBase58().slice(-4)}
                      </p>
                    </div>
                    <button
                      className="border border-greyscale3 group hover:border-incorrect w-[30px] h-[30px] flex items-center justify-center"
                      onClick={() => handleTwitterUnlink()}
                    >
                      <svg
                        width="16"
                        height="13"
                        className="group-hover:hidden"
                        viewBox="0 0 16 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.53125 3.59375C5.84375 2.28125 8 2.28125 9.3125 3.59375C10.4844 4.76562 10.6484 6.61719 9.6875 7.97656L9.66406 8C9.42969 8.35156 8.96094 8.42188 8.60938 8.1875C8.28125 7.92969 8.1875 7.46094 8.44531 7.13281L8.46875 7.10938C9.00781 6.33594 8.91406 5.32812 8.25781 4.67188C7.53125 3.92188 6.33594 3.92188 5.58594 4.67188L2.96094 7.29688C2.21094 8.02344 2.21094 9.21875 2.96094 9.96875C3.61719 10.625 4.64844 10.6953 5.39844 10.1797L5.42188 10.1328C5.77344 9.89844 6.24219 9.96875 6.47656 10.3203C6.71094 10.6484 6.64062 11.1172 6.3125 11.375L6.26562 11.3984C4.90625 12.3594 3.07812 12.1953 1.90625 11.0234C0.570312 9.71094 0.570312 7.55469 1.90625 6.24219L4.53125 3.59375ZM11.4453 9.40625C10.1328 10.7422 7.97656 10.7422 6.66406 9.40625C5.49219 8.23438 5.32812 6.40625 6.28906 5.04688L6.3125 5.02344C6.54688 4.67188 7.01562 4.60156 7.36719 4.83594C7.69531 5.07031 7.78906 5.53906 7.53125 5.89062L7.50781 5.91406C6.96875 6.66406 7.0625 7.69531 7.71875 8.35156C8.44531 9.10156 9.64062 9.10156 10.3906 8.35156L13.0156 5.72656C13.7656 4.97656 13.7656 3.78125 13.0156 3.05469C12.3594 2.39844 11.3281 2.30469 10.5781 2.84375L10.5547 2.86719C10.2031 3.125 9.73438 3.03125 9.5 2.70312C9.26562 2.375 9.33594 1.90625 9.66406 1.64844L9.71094 1.625C11.0703 0.664062 12.8984 0.828125 14.0703 2C15.4062 3.3125 15.4062 5.46875 14.0703 6.78125L11.4453 9.40625Z"
                          fill="#A89FA8"
                        />
                      </svg>
                      <svg
                        width="16"
                        height="13"
                        className="group-hover:block hidden"
                        viewBox="0 0 16 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.83594 3.33594C6.17188 2.28125 8.09375 2.375 9.3125 3.59375C10.3438 4.625 10.5781 6.125 10.0156 7.39062L10.7656 7.97656L13.0156 5.72656C13.7656 4.97656 13.7656 3.78125 13.0156 3.05469C12.3594 2.39844 11.3281 2.30469 10.5781 2.84375L10.5547 2.86719C10.2031 3.125 9.73438 3.03125 9.5 2.70312C9.26562 2.375 9.33594 1.90625 9.66406 1.64844L9.71094 1.625C11.0703 0.664062 12.8984 0.828125 14.0703 2C15.4062 3.3125 15.4062 5.46875 14.0703 6.78125L11.9609 8.91406L15.2656 11.5156C15.5234 11.7031 15.5703 12.0547 15.3594 12.2891C15.1719 12.5469 14.8203 12.5938 14.5859 12.3828L0.710938 1.50781C0.453125 1.32031 0.40625 0.96875 0.617188 0.734375C0.804688 0.476562 1.15625 0.429688 1.39062 0.640625L4.83594 3.33594ZM6.07812 4.29688L8.77344 6.40625C8.91406 5.79688 8.72656 5.14062 8.25781 4.67188C7.67188 4.08594 6.80469 3.94531 6.07812 4.29688ZM6.66406 9.40625C5.96094 8.72656 5.60938 7.76562 5.65625 6.82812L10.0156 10.2734C8.86719 10.6016 7.55469 10.3203 6.66406 9.40625ZM3.21875 4.90625L4.41406 5.84375L2.96094 7.29688C2.21094 8.02344 2.21094 9.21875 2.96094 9.96875C3.61719 10.625 4.64844 10.6953 5.39844 10.1797L5.42188 10.1328C5.77344 9.89844 6.24219 9.96875 6.47656 10.3203C6.71094 10.6484 6.64062 11.1172 6.3125 11.375L6.26562 11.3984C4.90625 12.3594 3.07812 12.1953 1.90625 11.0234C0.570312 9.71094 0.570312 7.55469 1.90625 6.24219L3.21875 4.90625Z"
                          fill="#E1233D"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
              <Divider margin="0px" />
            </div>
          )}
          <div className="flex flex-col items-start gap-5 p-5">
            <a
              className="text-lg w-fit hover:text-purple1"
              href={generalConfig.appUrl}
            >
              Games
            </a>
            <button
              className="text-lg w-fit hover:text-purple1"
              onClick={() => router.push("/leaderboard")}
            >
              Leaderboard
            </button>
            <div className="flex items-center gap-1.5">
              <button
                className="text-lg w-fit hover:text-purple1"
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
            <p className="text-lg hover:text-purple1">Degen Picks Handbook</p>
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
                <p className="text-lg hover:text-purple1">Sign out</p>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
