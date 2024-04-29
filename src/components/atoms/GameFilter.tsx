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
        className={`h-[30px] px-[15px] rounded-[10px] flex items-center justify-center ${
          activeFilter
            ? "bg-data text-black"
            : "bg-transparent text-white hover:bg-data/70 hover:text-black/70"
        }`}
        onClick={() => setActiveFilter(true)}
      >
        <p>Live</p>
      </motion.button>
      <motion.button
        className={`h-[30px] px-[15px] rounded-[10px] flex items-center justify-center ${
          !activeFilter
            ? "bg-data text-black"
            : "bg-transparent text-white hover:bg-data/70 hover:text-black/70"
        }`}
        onClick={() => setActiveFilter(false)}
      >
        <p>Past</p>
      </motion.button>
    </div>
  );
};

export default GameFilter;
