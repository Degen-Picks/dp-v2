import { FC, useContext, useEffect } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { login, logout } from "@/utils";
import {
  WagerUserContext,
  WagerUserContextType,
} from "../stores/WagerUserStore";

interface Props {
  buttonClasses?: string;
  textClasses?: string;
  connectText?: string;
}

const ConnectButton: FC<Props> = ({
  buttonClasses,
  textClasses,
  connectText,
}) => {
  const { wagerUser, setWagerUser } = useContext(
    WagerUserContext
  ) as WagerUserContextType;

  const wallet = useWallet();
  const { publicKey } = wallet;

  useEffect(() => {
    async function load() {
      const loginUser = await login(wallet);
      if (loginUser !== null) {
        setWagerUser(loginUser);
      }
    }

    if (publicKey) {
      load();
    }
  }, [publicKey]);

  // Logout on disconnect/wallet change
  useEffect(() => {
    async function load() {
      const logoutUser = await logout();
      console.log("Logged out", logoutUser);
      setWagerUser(null);
    }

    if (!publicKey) {
      load();
    }
  }, [publicKey]);

  return (
    <div
      className={`${
        buttonClasses
          ? buttonClasses
          : "!bg-black !relative !w-full flex items-center justify-center md:!px-0 !h-auto !rounded-none !z-50"
      }`}
    >
      <WalletMultiButton
        className="!w-full md:!w-[168px] !flex !justify-center"
        // startIcon={undefined}
      >
        <p
          className={`${
            textClasses
              ? textClasses
              : "!font-base !text-lg !whitespace-nowrap1"
          }`}
        >
          {publicKey
            ? publicKey.toBase58().slice(0, 4) +
              " ... " +
              publicKey.toBase58().slice(-4)
            : connectText}
        </p>
      </WalletMultiButton>
    </div>
  );
};

export default ConnectButton;
