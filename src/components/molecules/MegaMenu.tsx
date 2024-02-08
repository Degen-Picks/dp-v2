import { FC, useRef } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { useOutsideAlerter } from "@/hooks/useOutsideAlerter";
import { WagerUser } from "@/types";
import { motion } from "framer-motion";
import Link from "next/link";
import DeIDLoginButton from "./DeIDLoginButton";
import ConnectButton from "../atoms/ConnectButton";
import Twitter from "../@icons/Twitter";
import Discord from "../@icons/Discord";

interface Props {
  setIsOpen: (open: boolean) => void;
  userData: WagerUser | undefined;
  setUserData: (user: WagerUser | undefined) => void;
}

const MegaMenu: FC<Props> = ({ setIsOpen, userData, setUserData }) => {
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, () => setIsOpen(false));

  return (
    <>
      <motion.div
        className="md:hidden fixed w-full h-fit inset-0 top-0 z-50 shadow-xl text-white"
        initial={{ y: "-100%" }}
        animate={{ y: "0" }}
        exit={{ y: "-100%" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        key="menu"
      >
        <div className="relative w-full sm:w-[300px]" ref={wrapperRef}>
          <div className="relative flex flex-col w-full bg-black">
            {/* header */}
            <div className="w-full h-20 relative flex justify-between px-4 items-center">
              <div className="w-[50px] h-[50px]" />
              <Link href="https://degenpicks.xyz/">
                <Image
                  src="/images/logo_og.png"
                  width={70}
                  height={70}
                  alt="degen picks logo"
                  priority
                />
              </Link>
              <button
                className="h-[50px] w-[50px] bg-background2 flex items-center justify-center rounded-[20px]"
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                <X color="white" size={16} />
              </button>
            </div>
            <div className="w-full flex flex-col items-center gap-2.5 p-5">
              <ConnectButton full />
              <DeIDLoginButton type="modal" full />
              <div className="flex items-center gap-5 pt-2.5">
                <div className="w-[50px] h-[50px] border border-foregroundMed flex items-center justify-center rounded-full">
                  <Twitter width={20} fill="#808080" />
                </div>
                <div className="w-[50px] h-[50px] border border-foregroundMed flex items-center justify-center rounded-full">
                  <Discord width={25} fill="#808080" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      <div className="opacity-30 fixed inset-0 z-40 bg-black" />
    </>
  );
};

export default MegaMenu;
