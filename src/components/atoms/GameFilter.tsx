import { Dispatch, FC, SetStateAction } from "react";
import { motion } from "framer-motion";

interface Props {
  activeFilter: boolean;
  setActiveFilter: Dispatch<SetStateAction<boolean>>;
}

const GameFilter: FC<Props> = ({ activeFilter, setActiveFilter }) => {
  return (
    <div className="relative h-[38px] flex items-center gap-1 z-40 bg-greyscale1 p-1">
      <motion.button
        className={`w-[80px] h-[30px] flex items-center justify-center ${
          activeFilter
            ? "bg-greyscale6 text-greyscale1"
            : "bg-transparent  hover:bg-greyscale2"
        }`}
        onClick={() => setActiveFilter(true)}
      >
        <p>Live</p>
      </motion.button>
      <motion.button
        className={`w-[80px] h-[30px] flex items-center justify-center ${
          !activeFilter
            ? "bg-greyscale6 text-greyscale1"
            : "bg-transparent  hover:bg-greyscale2"
        }`}
        onClick={() => setActiveFilter(false)}
      >
        <p>Past</p>
      </motion.button>
    </div>
  );
};

export default GameFilter;
