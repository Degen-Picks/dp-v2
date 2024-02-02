import { FC, useContext, useEffect, useState } from "react";
import {
  WagerUserContext,
  WagerUserContextType,
} from "../stores/WagerUserStore";
import { motion } from "framer-motion";
import { View } from "@/pages/superbowl";

interface Props {
  view: View;
  setView: (view: View) => void;
}

const SuperbowlToggle: FC<Props> = ({ view, setView }) => {
  const { wagerUser } = useContext(WagerUserContext) as WagerUserContextType;

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (wagerUser && wagerUser.roles.includes("ADMIN")) {
      setIsAdmin(true);
    } else {
      setView(View.RULES);
      setIsAdmin(false);
    }
  }, [wagerUser]);

  return (
    <div
      className={`absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2`}
    >
      <div
        className={`h-[50px] flex items-center gap-1 p-1.5 bg-greyscale5 rounded-[82px]`}
      >
        {Object.values(View).map((v) => (
          <motion.button
            key={v}
            className={`${
              view === v
                ? "bg-greyscale1 text-greyscale6"
                : "bg-transparent hover:bg-greyscale6/20 text-white"
            } ${
              !isAdmin && v === View.ADMIN && "hidden"
            } w-[100px] h-[38px] flex items-center justify-center rounded-[70px]`}
            onClick={() => setView(v)}
          >
            {v}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default SuperbowlToggle;
