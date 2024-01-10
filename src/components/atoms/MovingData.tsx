import { FC, ReactNode } from "react";
import { motion } from "framer-motion";

interface Props {
  children: ReactNode;
}

const MovingText: FC<Props> = ({ children }) => {
  return (
    <div className="relative w-full flex items-center h-[60px] justify-center overflow-hidden">
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: "-100%" }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        className="absolute text-center whitespace-nowrap"
      >
        {children}
      </motion.div>
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: "-100%" }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "linear",
          delay: 7,
        }}
        className="absolute text-center whitespace-nowrap"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default MovingText;
