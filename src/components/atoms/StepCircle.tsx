import { smallClickAnimation } from "@/configs";
import { motion } from "framer-motion";
import { FC } from "react";

interface Props {
  filled: boolean;
  onClick: () => void;
}

const StepCircle: FC<Props> = ({ filled, onClick }) => {
  return (
    <motion.button {...smallClickAnimation} onClick={onClick}>
      <svg
        width="6"
        height="6"
        viewBox="0 0 6 6"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          width="6"
          height="6"
          rx="3"
          fill={filled ? "#000000" : "#A89FA8"}
        />
      </svg>
    </motion.button>
  );
};

export default StepCircle;
