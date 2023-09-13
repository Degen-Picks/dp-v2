import { FC } from "react";
import Image from "next/image";
import { smallClickAnimation } from "@/configs";
import { motion } from "framer-motion";

interface Props {
  url?: string;
}

const TwitterShareButton: FC<Props> = ({ url }) => {
  // The text you want to tweet out
  const tweetText = `Check out this pool on @degenpicksxyz\n\n${url}`;

  // Construct the Twitter link with the encoded tweet text
  const twitterLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    tweetText
  )}`;

  return (
    <motion.button
      className="flex items-center justify-center gap-[5px] px-3 py-1 fill-purple1 hover:fill-purple2 text-purple1 hover:text-purple2"
      onClick={() => window.open(twitterLink, "_blank", "noopener noreferrer")}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height={14}
        width={14}
        viewBox="0 0 512 512"
      >
        <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
      </svg>
      <p className="text-lg">Share</p>
    </motion.button>
  );
};

export default TwitterShareButton;
