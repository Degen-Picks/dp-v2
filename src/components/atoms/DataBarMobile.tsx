import { FC, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronsUpDown } from "lucide-react";
import { DataType } from "./DataBar";
import { AnimatePresence, motion } from "framer-motion";

export enum DataInView {
  POOLS,
  TOKENS1,
  TOKENS2,
}

const DataBarMobile: FC = () => {
  const [dataType, setDataType] = useState<DataType>(DataType.LIVE);
  const [dataInView, setDataInView] = useState<DataInView>(DataInView.POOLS);

  // use a time interval to toggle the dataInView
  const toggleViews = () => {
    setDataInView((prevDataInView) => {
      const enumValues = [
        DataInView.POOLS,
        DataInView.TOKENS1,
        DataInView.TOKENS2,
      ];
      const enumLength = enumValues.length;

      const currentViewIndex = enumValues.indexOf(prevDataInView);
      const nextViewIndex = (currentViewIndex + 1) % enumLength;

      return enumValues[nextViewIndex];
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      toggleViews();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 w-screen z-10">
      <div className="w-screen h-16 bg-[#1B1B1B] flex items-center">
        <div className="flex items-center">
          <div
            className="cursor-pointer flex items-center justify-center 
            gap-2 border-r border-greyscale1/20 p-5"
            onClick={() =>
              setDataType(
                dataType === DataType.LIVE ? DataType.TOTAL : DataType.LIVE
              )
            }
          >
            <div className="animate-pulse">
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="5"
                  cy="5"
                  r="2"
                  fill={dataType === DataType.LIVE ? "#14F195" : "#FECE00"}
                />
                <circle
                  cx="5"
                  cy="5"
                  r="3.5"
                  stroke={dataType === DataType.LIVE ? "#14F195" : "#FECE00"}
                  stroke-opacity="0.15"
                  stroke-width="3"
                />
              </svg>
            </div>
            <p className="text-greyscale1 text-lg">
              {dataType === DataType.LIVE ? "Live" : "All"}
            </p>
            <ChevronsUpDown size={16} color="white" />
          </div>
          <AnimatePresence mode="wait">
            {dataInView === DataInView.POOLS && (
              <motion.div
                className="flex items-center justify-center gap-5 px-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                key={"pools"}
              >
                <p className="text-greyscale1 text-lg leading-4">
                  {dataType === DataType.LIVE ? "5" : "420"}{" "}
                  <span className="text-greyscale4">pools</span>
                </p>
                <p className="text-greyscale1 text-lg leading-4">
                  {dataType === DataType.LIVE ? "25" : "946"}{" "}
                  <span className="text-greyscale4">players</span>
                </p>
                <p className="text-greyscale1 text-lg leading-4">
                  {dataType === DataType.LIVE ? "30" : "1043"}{" "}
                  <span className="text-greyscale4">picks</span>
                </p>
              </motion.div>
            )}
            {dataInView === DataInView.TOKENS1 && (
              <motion.div
                className="flex items-center justify-center gap-5 px-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                key="tokens1"
              >
                <div className="flex items-center gap-[5px]">
                  <Image
                    src="/images/icons/solana.png"
                    width={24}
                    height={24}
                    alt="solana"
                  />
                  <p className="text-greyscale1 text-lg">
                    {dataType === DataType.LIVE ? "69" : "420"}{" "}
                    <span className="text-greyscale4">SOL</span>
                  </p>
                </div>
                <div className="flex items-center gap-[5px]">
                  <Image
                    src="/images/icons/dust.png"
                    width={24}
                    height={24}
                    alt="dust"
                  />
                  <p className="text-greyscale1 text-lg">
                    {dataType === DataType.LIVE ? "69" : "420"}{" "}
                    <span className="text-greyscale4">DUST</span>
                  </p>
                </div>
              </motion.div>
            )}
            {dataInView === DataInView.TOKENS2 && (
              <motion.div
                className="flex items-center justify-center gap-5 px-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                key="tokens2"
              >
                <div className="flex items-center gap-[5px]">
                  <Image
                    src="/images/icons/usdc.png"
                    width={24}
                    height={24}
                    alt="usdc"
                  />
                  <p className="text-greyscale1 text-lg">
                    {dataType === DataType.LIVE ? "69" : "420"}{" "}
                    <span className="text-greyscale4">USDC</span>
                  </p>
                </div>
                <div className="flex items-center gap-[5px]">
                  <Image
                    src="/images/icons/crown-logo.png"
                    width={24}
                    height={24}
                    alt="crown"
                  />
                  <p className="text-greyscale1 text-lg">
                    {dataType === DataType.LIVE ? "69" : "420"}{" "}
                    <span className="text-greyscale4">CROWN</span>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default DataBarMobile;
