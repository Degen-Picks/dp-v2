import { Dispatch, FC, SetStateAction } from "react";
import { motion } from "framer-motion";
import { smallClickAnimation } from "@/configs";

interface Props {
  activeFilter: boolean;
  setActiveFilter: Dispatch<SetStateAction<boolean>>;
}

const GameFilter: FC<Props> = ({ activeFilter, setActiveFilter }) => {
  return (
    <div className="relative h-[38px] flex items-center gap-1 z-40 bg-white p-1">
      <motion.button
        className={`w-[80px] h-[30px] flex items-center justify-center ${
          activeFilter ? "bg-primary text-white" : "bg-transparent text-primary"
        }`}
        {...smallClickAnimation}
        onClick={() => setActiveFilter(true)}
      >
        <p>Live</p>
      </motion.button>
      <motion.button
        className={`w-[80px] h-[30px] flex items-center justify-center ${
          !activeFilter
            ? "bg-primary text-white"
            : "bg-transparent text-primary"
        }`}
        {...smallClickAnimation}
        onClick={() => setActiveFilter(false)}
      >
        <p>Past</p>
      </motion.button>
    </div>
  );
};

export default GameFilter;
