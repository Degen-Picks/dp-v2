import { FC, useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { ConnectButton, MegaMenu, MegaMenuButton } from "@/components";
import Link from "next/link";
import { useWindowSize } from "@/hooks/useWindowSize";
import { motion } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";
import { AlignJustify } from "lucide-react";
import { WagerUser } from "@/types";
import { generalConfig } from "@/configs";
import { login, logout } from "@/utils";
import {
  WagerUserContext,
  WagerUserContextType,
} from "../stores/WagerUserStore";
import SuperbowlToggle from "../molecules/SuperbowlToggle";
import DeIDLoginButton from "../molecules/DeIDLoginButton";
import { View } from "@/pages/superbowl";

interface Props {
  landing?: boolean;
  view?: View;
  setView?: (view: View) => void;
}

const Navbar: FC<Props> = ({ landing = false, view, setView }) => {
  const { wagerUser, setWagerUser } = useContext(
    WagerUserContext
  ) as WagerUserContextType;

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState<WagerUser | undefined>();

  const wallet = useWallet();
  const { publicKey } = wallet;
  const router = useRouter();

  const [winWidth] = useWindowSize();
  const isMobile = winWidth < 1024;

  // const previousPublicKeyRef = useRef<PublicKey | null>();
  const [canLogout, setCanLogout] = useState(false);

  // Public key state tracking
  useEffect(() => {
    if(publicKey) {
      setCanLogout(true);
    }
  }, [publicKey]);

  // Handle login
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
      setWagerUser(null);
      await logout();
    }

    // Check if publicKey changed from not null to null
    if (canLogout && !publicKey) {
      load();
    }
  }, [publicKey]);

  const loadUserData = async () => {
    try {
      const url = `${generalConfig.apiUrl}/oauth/status?publicKey=${publicKey}`;
      const res = await fetch(url);
      if (res.status === 404) {
        return;
      }
      const data: WagerUser = await res.json();
      setUserData(data || {});
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (publicKey) {
      loadUserData();
    }
  }, [publicKey]);

  const renderMenu = () => {
    if (!publicKey) {
      return (
        <div className="flex items-center gap-2.5">
          <ConnectButton />
          <button
            className="w-[50px] h-[50px] flex items-center justify-center"
            onClick={() => setOpen(true)}
          >
            <AlignJustify color="white" />
          </button>
        </div>
      );
    }
    return (
      <button onClick={() => setOpen(true)}>
        <MegaMenuButton userData={userData} />
      </button>
    );
  };

  useEffect(() => {
    if (router.isReady) {
      setMounted(true);
    }
  }, [router.isReady]);

  if (!mounted) return null;

  return (
    <>
      <div className={`border-b border-[#404040] z-20 h-20`}>
        <div
          className="relative flex justify-between items-center
          max-w-[1600px] mx-auto px-4 lg:px-10"
        >
          <Link href="https://degenpicks.xyz/">
            <Image
              src="/images/logo_new.png"
              width={isMobile ? 60 : 70}
              height={isMobile ? 60 : 70}
              alt="degen picks logo"
              priority
            />
          </Link>
          <div className="relative flex items-center gap-4 justify-end">
            {landing ? (
              <motion.button
                className="bg-purple1 hover:bg-purple2 text-greyscale1 h-[50px] px-5"
                onClick={() => router.push("https://app.degenpicks.xyz/")}
              >
                Launch app
              </motion.button>
            ) : null}

            {!landing && <DeIDLoginButton />}

            {!landing && <ConnectButton />}


            {open && (
              <MegaMenu
                userData={userData}
                setUserData={setUserData}
                setIsOpen={setOpen}
              />
            )}
          </div>
          {!landing && view && setView && (
            <SuperbowlToggle view={view} setView={setView} />
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
