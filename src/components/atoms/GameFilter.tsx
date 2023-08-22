import { Dispatch, FC, SetStateAction } from "react";
import { motion } from "framer-motion";
import { smallClickAnimation } from "@/configs";

interface Props {
  activeFilter: boolean;
  setActiveFilter: Dispatch<SetStateAction<boolean>>;
}

const GameFilter: FC<Props> = ({ activeFilter, setActiveFilter }) => {
  return (
    <div className="relative w-[200px] h-[30px] flex items-center z-40">
      <motion.button
        className={`w-1/2 h-full flex items-center justify-center ${
          activeFilter ? "bg-primary text-white" : "bg-transparent text-primary"
        }`}
        {...smallClickAnimation}
        onClick={() => setActiveFilter(true)}
      >
        <p>Live</p>
      </motion.button>
      <motion.button
        className={`w-1/2 h-full flex items-center justify-center ${
          !activeFilter
            ? "bg-primary text-white"
            : "bg-transparent text-primary"
        }`}
        {...smallClickAnimation}
        onClick={() => setActiveFilter(false)}
      >
        <p>Completed</p>
      </motion.button>
    </div>
  );
};

export default GameFilter;
