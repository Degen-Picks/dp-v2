import { FC } from "react";
import { Twitter, Discord } from "@/components";

const Footer: FC = () => {
  return (
    <div className="bg-white text-center px-4">
      <div className="flex flex-col gap-5 md:gap-0 md:flex-row items-start md:items-center justify-between max-w-[1000px] mx-auto py-8 md:py-16">
        <div className="flex flex-col gap-2 text-left whitespace-nowrap">
          <p className="text-secondary">Useful links</p>
          <a
            href="https://docs.dustprotocol.com/"
            target="_blank"
            className="underline"
            rel="noreferrer noopener"
          >
            DUST Documentation
          </a>
          <a
            href="https://jup.ag/swap/SOL-DUST"
            target="_blank"
            rel="noreferrer noopener"
            className="underline"
          >
            Buy DUST on Jupiter
          </a>
        </div>
        <div className="flex flex-col items-start md:items-center">
          <p className="text-base md:text-xl text-secondary md:text-black pb-3">
            Follow us
          </p>
          <div className="flex space-x-2">
            <Twitter className="fill-black" />
            <Discord className="fill-black" />
          </div>
        </div>
        <div className="text-secondary">© 2023 Degen Picks</div>
      </div>
    </div>
  );
};

export default Footer;
