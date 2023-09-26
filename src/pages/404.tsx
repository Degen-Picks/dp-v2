import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useRouter } from "next/router";

export const NotFound = () => {
  const [mounted, setMounted] = useState(false);

  const [winWidth] = useWindowSize();
  const isMobile = winWidth < 1024;

  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-screen h-screen">
      {isMobile ? (
        <div className="w-full h-full flex flex-col gap-5 items-center justify-center">
          <Image
            src="/images/landing/dp_scuba_mobile.png"
            width={370}
            height={370}
            alt="DP artwork by scuba"
            priority
            className="w-fit mx-auto px-5"
          />
          <div className="w-full flex flex-col justify-center items-center px-5 gap-5">
            <p className="text-center">
              Uh-Oh, seems like you&apos;ve ventured into unknown territory.
            </p>
            <motion.button
              className="bg-purple1 text-greyscale1 w-full max-w-[370px] h-[50px] text-lg"
              onClick={() => router.push("/")}
            >
              Go Back
            </motion.button>
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-10">
          <Image
            src="/images/landing/dp_scuba.png"
            width={940}
            height={500}
            alt="DP artwork by scuba"
            priority
            className="mx-auto"
          />
          <div className="w-full flex flex-col justify-center items-center px-5 gap-5">
            <p className="text-lg text-center">
              Uh-Oh, seems like you&apos;ve ventured into unknown territory.
            </p>
            <motion.button
              className="bg-purple1 text-greyscale1 w-full max-w-[370px] h-[50px] text-lg"
              onClick={() => router.push("/")}
            >
              Go Back
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotFound;
