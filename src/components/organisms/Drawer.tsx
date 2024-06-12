import { Wager } from "@/types";
import { useWallet } from "@solana/wallet-adapter-react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { FC } from "react";

interface Props {
  setDrawerOpen: (value: boolean) => void;
  game: Wager | null;
}

const Drawer: FC<Props> = ({ setDrawerOpen, game }) => {
  const wallet = useWallet();
  const options = game?.selections ?? [];
  const winner = options.find((o) => o.winner)?._id;
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.5 }}
        className="w-[600px] min-h-screen h-full border-l border-border z-40 px-10 py-6"
      >
        <X
          color="white"
          size={18}
          onClick={() => setDrawerOpen(false)}
          className="absolute top-4 right-6 cursor-pointer"
        />
        {game && (
          <div className="flex flex-col gap-5 justify-center">
            <div className="flex flex-col gap-2 justify-center">
              <p className="text-greyscale1 text-[18px] font-base-b">
                {game.title}
              </p>
              {game.description && (
                <p className="text-greyscale4 text-xs">{game.description}</p>
              )}
            </div>
            <div
              className={`w-full flex gap-0.5 h-[70px] ${
                !wallet.publicKey ? "text-greyscale1/50" : "text-greyscale1"
              }`}
            >
              {options.map((o, index) => (
                <button
                  key={o._id}
                  disabled={!wallet.publicKey}
                  className={`p-2.5 w-full h-full rounded-[20px] disabled:cursor-not-allowed ${
                    index < 1 && "rounded-r-none"
                  } ${index > 0 && "rounded-l-none"} ${
                    winner === o._id
                      ? "bg-[#282622] border border-data"
                      : "bg-greyscale5 hover:bg-greyscale1/10 disabled:hover:bg-greyscale5"
                  }`}
                  // onClick={() => handleSelect(o._id)}
                >
                  {o.title}
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default Drawer;
