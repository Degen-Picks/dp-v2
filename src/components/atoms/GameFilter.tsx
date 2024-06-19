import { Dispatch, FC, SetStateAction } from "react";
import { motion } from "framer-motion";

interface Props {
  activeFilter: boolean;
  setActiveFilter: Dispatch<SetStateAction<boolean>>;
}

const GameFilter: FC<Props> = ({ activeFilter, setActiveFilter }) => {
  return (
    <div className="relative flex items-center gap-2.5 z-40 mr-auto">
      <motion.button
        className={`h-[30px] p-[10px] rounded-[10px] flex items-center justify-center border ${
          activeFilter
            ? "border-data text-data"
            : "border-transparent text-disabled hover:text-disabled/70"
        }`}
        onClick={() => setActiveFilter(true)}
      >
        <p className="text-sm">Live</p>
      </motion.button>
      <motion.button
        className={`h-[30px] p-[10px] rounded-[10px] flex items-center justify-center border ${
          !activeFilter
            ? "border-data text-data"
            : "border-transparent text-disabled hover:text-disabled/70"
        }`}
        onClick={() => setActiveFilter(false)}
      >
        <p className="text-sm">Settled</p>
      </motion.button>
    </div>
  );
};

export default GameFilter;
