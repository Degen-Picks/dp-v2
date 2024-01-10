import { FC, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronsUpDown } from "lucide-react";
import { DataType } from "./DataBar";
import { AnimatePresence, motion } from "framer-motion";
import { Stats, Volume } from "@/types";
import TokenDisplay from "./TokenDisplay";

export enum DataInView {
  POOLS,
  TOKENS1,
  TOKENS2,
}

interface Props {
  stats: Stats;
}

const DataBarMobile: FC<Props> = ({ stats }) => {
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
  
  const dataToUse = dataType === DataType.LIVE ? stats.live.totalVolume : stats.total.totalVolume;  

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
                  {dataType === DataType.LIVE ? stats.live.gamesHosted : stats.total.gamesHosted}{" "}
                  <span className="text-greyscale4">pools</span>
                </p>
                <p className="text-greyscale1 text-lg leading-4">
                  {dataType === DataType.LIVE ? stats.live.uniquePlayers : stats.total.uniquePlayers}{" "}
                  <span className="text-greyscale4">players</span>
                </p>
                <p className="text-greyscale1 text-lg leading-4">
                  {dataType === DataType.LIVE ? stats.live.totalPicks : stats.total.totalPicks}{" "}
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
                <TokenDisplay token="SOL" data={dataToUse} />
                <TokenDisplay token="DUST" data={dataToUse} />
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
                <TokenDisplay token="USDC" data={dataToUse} />
                <TokenDisplay token="CROWN" data={dataToUse} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default DataBarMobile;
