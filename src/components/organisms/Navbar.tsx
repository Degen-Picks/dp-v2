import { FC, useEffect, useState } from "react";
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

interface Props {
  landing?: boolean;
}

const Navbar: FC<Props> = ({ landing = false }) => {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState<WagerUser | undefined>();

  const { publicKey } = useWallet();
  const router = useRouter();

  const [winWidth] = useWindowSize();
  const isMobile = winWidth < 1024;

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
            <AlignJustify />
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
      <div className={`bg-greyscale1 md:bg-transparent z-20`}>
        <div
          className="relative flex justify-between 
          py-4 max-w-[1600px] mx-auto px-4 lg:px-10"
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

            {!landing && renderMenu()}
            {open && (
              <MegaMenu
                userData={userData}
                setUserData={setUserData}
                setIsOpen={setOpen}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
