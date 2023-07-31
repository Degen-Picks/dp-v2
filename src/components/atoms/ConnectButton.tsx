import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import Image from "next/image";
import { useContext, useEffect } from "react";
import { login, logout } from "@/utils";
import { WagerUserContext, WagerUserContextType } from "../stores/WagerUserStore";

const ConnectButton = () => {
  const { wagerUser, setWagerUser } = useContext(WagerUserContext) as WagerUserContextType;

  const wallet = useWallet();
  const { publicKey } = wallet;

  useEffect(() => {
    async function load() {
      const loginUser = await login(wallet);
      setWagerUser(loginUser);
    }
   
    if(publicKey) {
      load();
    }
  }, [publicKey]);

  // Logout on disconnect/wallet change
  useEffect(() => {
    async function load() {
      const logoutUser = await logout();
      console.log("Logged out", logoutUser)
      setWagerUser(null);
    }

    if (!publicKey) {
      load();
    }
  }, [publicKey]);

  return (
    <>
      <div className="relative sm:hidden bg-black z-50">
        <WalletMultiButton
          className="!w-[60px] !h-[60px] !p-0 !rounded-none flex justify-center !font-base"
          startIcon={undefined}
        >
          <Image
            src="/images/icons/wallet.svg"
            width={20}
            height={20}
            alt="wallet icon"
          />
        </WalletMultiButton>
      </div>
      <div
        className="hidden sm:block !bg-black !relative !w-full
        md:!px-0 !h-auto !rounded-none !z-50"
      >
        <WalletMultiButton
          className="!w-auto md:!w-[168px] !flex !justify-center"
          startIcon={undefined}
        >
          <p className="!font-base !text-base !whitespace-nowrap">
            {publicKey
              ? publicKey.toBase58().slice(0, 4) +
                " ... " +
                publicKey.toBase58().slice(-4)
              : "Connect Wallet"}
          </p>
        </WalletMultiButton>
      </div>
    </>
  );
};

export default ConnectButton;
