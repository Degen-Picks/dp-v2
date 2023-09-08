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
    <WalletMultiButton
      className={`!relative flex items-center justify-center ${
        buttonClasses
          ? buttonClasses
          : "!bg-black !px-8 !py-2.5 !w-full !h-auto !rounded-none !z-50"
      }`}
      // startIcon={undefined}
    >
      <p
        className={`!text-lg !whitespace-nowrap ${
          textClasses ? textClasses : "!font-base"
        }`}
      >
        {publicKey
          ? publicKey.toBase58().slice(0, 4) +
            " ... " +
            publicKey.toBase58().slice(-4)
          : connectText ?? "Connect"}
      </p>
    </WalletMultiButton>
  );
};

export default ConnectButton;
