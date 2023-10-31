import { FC, useState } from "react";
import Image from "next/image";
import { ChevronsUpDown } from "lucide-react";

export enum DataType {
  LIVE,
  TOTAL,
}

const DataBar: FC = () => {
  const [dataType, setDataType] = useState<DataType>(DataType.LIVE);

  return (
    <div className="fixed bottom-0 left-0 w-screen z-10">
      <div className="w-screen bg-[#1B1B1B] flex items-center justify-between lg:px-[50px]">
        <div className="flex items-center">
          <div
            className="cursor-pointer flex items-center justify-center 
            gap-2 border-x border-greyscale1/20 p-5"
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
          <div className="flex items-center justify-center gap-5 border-r border-greyscale1/20 p-5">
            <p className="text-greyscale1 text-lg">
              {dataType === DataType.LIVE ? "5" : "420"}{" "}
              <span className="text-greyscale4">pools</span>
            </p>
            <p className="text-greyscale1 text-lg">
              {dataType === DataType.LIVE ? "25" : "946"}{" "}
              <span className="text-greyscale4">players</span>
            </p>
            <p className="text-greyscale1 text-lg">
              {dataType === DataType.LIVE ? "30" : "1043"}{" "}
              <span className="text-greyscale4">picks</span>
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-5 border-x border-greyscale1/20 p-5">
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
        </div>
      </div>
    </div>
  );
};

export default DataBar;
