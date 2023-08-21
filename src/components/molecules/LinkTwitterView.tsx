import { FC } from "react";
import { TwitterLoginButton } from "@/components";
import { ModalView } from "../organisms/RulesModal";
import Image from "next/image";

interface Props {
  modalView: ModalView;
}

const LinkTwitterView: FC<Props> = ({ modalView }) => {
  return (
    <div
      className={`${modalView === ModalView.LinkTwitter ? "block" : "hidden"}
      w-full pt-4 pb-8 text-center gap-5
      flex flex-col items-center justify-center`}
    >
      <Image
        src="/images/icons/twitter_dp.png"
        width={95}
        height={50}
        alt="connect your twitter to DP"
      />
      <p className="text-xl sm:text-2xl font-base-b text-center">
        Link Twitter / X
      </p>
      <p className="max-w-[400px] mx-auto">
        Degen Picks™ is best played with friends. Link Twitter to unlock
        features and enhance your experience.
      </p>
      <TwitterLoginButton />
    </div>
  );
};

export default LinkTwitterView;
