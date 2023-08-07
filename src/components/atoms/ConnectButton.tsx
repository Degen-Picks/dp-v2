import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { useContext, useEffect } from "react";
import { login, logout } from "@/utils";
import {
  WagerUserContext,
  WagerUserContextType,
} from "../stores/WagerUserStore";

const ConnectButton = () => {
  const { wagerUser, setWagerUser } = useContext(
    WagerUserContext
  ) as WagerUserContextType;

  const wallet = useWallet();
  const { publicKey } = wallet;

  useEffect(() => {
    async function load() {
      const loginUser = await login(wallet);
      setWagerUser(loginUser);
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
      className="!bg-black !relative !w-full flex items-center justify-center
        md:!px-0 !h-auto !rounded-none !z-50"
    >
      <WalletMultiButton
        className="!w-full md:!w-[168px] !flex !justify-center"
        // startIcon={undefined}
      >
        <p className="!font-base !text-lg !whitespace-nowrap">
          {publicKey
            ? publicKey.toBase58().slice(0, 4) +
              " ... " +
              publicKey.toBase58().slice(-4)
            : "Connect"}
        </p>
      </WalletMultiButton>
    </div>
  );
};

export default ConnectButton;
