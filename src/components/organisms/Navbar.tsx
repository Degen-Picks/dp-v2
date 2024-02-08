import { FC, useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { ConnectButton, MegaMenu, MegaMenuButton } from "@/components";
import Link from "next/link";
import { useWindowSize } from "@/hooks/useWindowSize";
import { AnimatePresence, motion } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";
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
import InfoModal from "./InfoModal";
import { AlignJustify } from "lucide-react";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  showInfoModal: boolean;
  setShowInfoModal: (show: boolean) => void;
  landing?: boolean;
  view?: View;
  setView?: (view: View) => void;
}

const Navbar: FC<Props> = ({
  open,
  setOpen,
  showInfoModal,
  setShowInfoModal,
  landing = false,
  view,
  setView,
}) => {
  const { wagerUser, setWagerUser } = useContext(
    WagerUserContext
  ) as WagerUserContextType;
  const wallet = useWallet();
  const { publicKey } = wallet;
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [userData, setUserData] = useState<WagerUser | undefined>();

  const [winWidth] = useWindowSize();
  const isMobile = winWidth < 768;

  // const previousPublicKeyRef = useRef<PublicKey | null>();
  const [canLogout, setCanLogout] = useState(false);

  // Public key state tracking
  useEffect(() => {
    if (publicKey) {
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

  const handleModalDismiss = () => {
    setShowInfoModal(false);
    sessionStorage.setItem("infoModalShown", "true");
  };

  useEffect(() => {
    if (publicKey) {
      loadUserData();
    }
  }, [publicKey]);

  useEffect(() => {
    if (router.isReady) {
      setMounted(true);
    }
  }, [router.isReady]);

  useEffect(() => {
    const modalShown = sessionStorage.getItem("infoModalShown");

    if (publicKey && !wagerUser?.deidData && !modalShown) {
      setShowInfoModal(true);
    }
  }, [publicKey, wagerUser]);

  if (!mounted) return null;

  return (
    <>
      <div className="relative w-full flex flex-col gap-6 items-center">
        <div
          className={`w-full border-b md:border-none border-[#404040] z-20 h-20`}
        >
          <div
            className="w-full h-full relative flex justify-between items-center
            max-w-[1600px] mx-auto px-4 lg:px-10"
          >
            {/* left */}
            <div className="md:hidden w-[50px]" />
            {/* middle, or left on desktop */}
            <Image
              src="/images/logo_og.png"
              width={70}
              height={70}
              alt="degen picks logo"
              priority
            />
            {/* right mobile */}
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden w-[50px] h-[50px] rounded-[20px] bg-background2 flex items-center justify-center"
            >
              <AlignJustify size={15} color="#fff" className="cursor-pointer" />
            </button>
            {/* right desktop */}
            <div className="hidden relative lg:flex items-center gap-4 justify-end">
              {!landing && publicKey && <DeIDLoginButton />}
              {!landing && <ConnectButton />}
            </div>
            {!landing && view && setView && !isMobile && (
              <SuperbowlToggle view={view} setView={setView} />
            )}
          </div>
        </div>
        {!landing && view && setView && isMobile && (
          <SuperbowlToggle view={view} setView={setView} />
        )}
      </div>
      <AnimatePresence mode="wait">
        {open && (
          <MegaMenu
            userData={userData}
            setUserData={setUserData}
            setIsOpen={setOpen}
          />
        )}
      </AnimatePresence>
      <InfoModal
        width="w-full md:w-[480px]"
        showModal={showInfoModal}
        setShowModal={handleModalDismiss}
      >
        <div className="w-full pt-4 text-center gap-2.5 flex flex-col items-center justify-center">
          <p className="text-xl sm:text-2xl text-center text-white">
            Connect your de[id]
          </p>
          <p className="max-w-[400px] mx-auto text-base text-center text-foregroundMed">
            Powered by DeLabs
          </p>
          <div className="my-8">
            <DeIDLoginButton type="modal" />
          </div>
        </div>
      </InfoModal>
    </>
  );
};

export default Navbar;
