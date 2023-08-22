import { FC } from "react";
import Image from "next/image";
import { smallClickAnimation } from "@/configs";
import { motion } from "framer-motion";

interface Props {
  url?: string;
}

const TwitterShareButton: FC<Props> = ({ url }) => {
  // The text you want to tweet out
  const tweetText = `Check out this game on @degenpicksxyz! ${url}`;

  // Construct the Twitter link with the encoded tweet text
  const twitterLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    tweetText
  )}`;

  return (
    <motion.button
      className="border border-link rounded-full flex items-center justify-center gap-2 px-3 py-1"
      {...smallClickAnimation}
      onClick={() => window.open(twitterLink, "_blank", "noopener noreferrer")}
    >
      <p className="text-link">Share</p>
      <Image
        src="/images/icons/x.png"
        width={20}
        height={20}
        alt="twitter icon"
      />
    </motion.button>
  );
};

export default TwitterShareButton;
