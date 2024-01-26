import { FC } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const SuperbowlRules: FC = () => {
  return (
    <motion.div
      className="w-fit mx-auto h-full flex flex-col flex-1 gap-[60px] items-center justify-center"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div>
        <p className="text-greyscale1 text-[40px] leading-[38px] font-figtree-bold text-center">
          de[superbowl] LVII
        </p>
        <p className="text-greyscale1 text-xl font-figtree text-center">
          a popup game by Degen Picks
        </p>
      </div>
      <div className="w-[620px] bg-greyscale1 flex items-center">
        <div className="w-1/2 p-2.5">
          <Image
            src="/images/superbowl/y00t.jpeg"
            width={1000}
            height={1000}
            alt="y00t"
          />
        </div>
        <div className="w-1/2 flex items-center justify-center">
          <p className="text-greyscale6 text-xl font-figtree-semi">
            Winner gets this y00t.
          </p>
        </div>
      </div>
      <p className="text-left text-greyscale1 font-figtree-semi mr-auto">
        * Each card costs 10 DUST.
        <br />* Each correct pick gets you 1 point.
        <br />* First place gets a y00t.
        <br />* Runner-up gets 33% of the entry fees.
        <br />* 10% of all entry fees are donated to the de[team] treasury.
      </p>
    </motion.div>
  );
};

export default SuperbowlRules;
