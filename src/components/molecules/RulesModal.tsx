import { Dispatch, FC, SetStateAction, useRef } from "react";
import { Close } from "@/components";
import Image from "next/image";
import { useOutsideAlerter } from "../../hooks/useOutsideAlerter";

interface Props {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  gameType: string;
}

const RulesModal: FC<Props> = ({ showModal, setShowModal, gameType }) => {
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, () => setShowModal(false));

  return (
    <>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden fixed inset-0 top-4 bottom-4 sm:top-0 sm:bottom-0 z-50 outline-none focus:outline-none mx-4">
            <div
              className="relative w-auto my-6 mx-auto max-w-4xl h-full sm:h-fit"
              ref={wrapperRef}
            >
              {/* content */}
              <div className="sm:px-20 sm:pt-10 px-8 pt-8 border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white">
                {/* header */}
                <div className="w-full border-b border-solid border-slate-200 rounded-t pb-8">
                  <div className="mx-auto w-full">
                    <p className="py-2 sm:text-xl text-center w-full">
                      {gameType === "classic"
                        ? `Degen Picks (Classic)`
                        : `JB's Sunday Pick'em`}
                    </p>
                    <div className="font-bingodilan text-center text-[22px] sm:text-[36px] text-black">
                      Rules
                    </div>
                  </div>
                  <button
                    className="absolute right-6 top-6"
                    onClick={() => setShowModal(false)}
                  >
                    <Close color="black" />
                  </button>
                </div>
                {/* body */}
                <div className="py-8 text-left">
                  <p className="text-sm sm:text-body-md pb-2 font-base-b">
                    How it works:
                  </p>
                  {gameType === "classic" ? (
                    <div className="flex flex-col md:flex-row md:justify-between text-sm sm:text-body-md">
                      <ul className="px-3">
                        <li className="pb-1">
                          👉 The pool is shared among winning picks (losers get
                          nothing)
                        </li>
                        <li className="pb-1">
                          👉 Multipliers are finalized when the pool closes, NOT
                          when you submit your pick
                        </li>
                        <li className="pb-1">
                          👉 Learn more about the{" "}
                          <a
                            href="https://en.wikipedia.org/wiki/Parimutuel_betting"
                            target="_blank"
                            rel="noreferrer"
                            className="underline text-link hover:text-linkHover"
                          >
                            parimutuel model
                          </a>
                        </li>
                      </ul>
                      <ul className="px-3">
                        <li className="pb-1">
                          👉 Picks cannot be changed or cancelled
                        </li>
                        <li className="pb-1">👉 Only 1 pick per wallet</li>
                        <li className="pb-1">
                          👉 6.9% platform fee on all picks
                        </li>
                        <li className="pb-1">
                          👉 Rewards normally airdropped to winners within 24h
                          of game result
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <div className="flex flex-col md:flex-row md:justify-between text-sm sm:text-body-md">
                      <ul className="px-3">
                        <li className="pb-1">
                          👉 1st/2nd/3rd split the pool 65/25/10
                        </li>
                        <li className="pb-1">
                          👉 Make your picks and submit to lock in
                        </li>
                        <li className="pb-1">
                          👉 Player with the most correct picks wins
                        </li>
                        <li className="pb-1">
                          👉 Tiebreaker input only used for ties
                        </li>
                      </ul>
                      <ul className="px-3">
                        <li className="pb-1">
                          👉 Only 1 submission per wallet
                        </li>
                        <li className="pb-1">
                          👉 Picks cannot be changed or cancelled
                        </li>
                        <li className="pb-1">
                          👉 Pick&apos;em closes 15 mins before the first games
                        </li>
                        <li className="pb-1">
                          👉 10% platform fee taken on all submissions
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
                <div className="bg-container px-6 sm:px-[20px] py-4 text-left">
                  <div className="flex flex-row items-center space-x-2">
                    {/* info icon */}
                    <div className="w-4 h-4 mr-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 128c17.67 0 32 14.33 32 32c0 17.67-14.33 32-32 32S224 177.7 224 160C224 142.3 238.3 128 256 128zM296 384h-80C202.8 384 192 373.3 192 360s10.75-24 24-24h16v-64H224c-13.25 0-24-10.75-24-24S210.8 224 224 224h32c13.25 0 24 10.75 24 24v88h16c13.25 0 24 10.75 24 24S309.3 384 296 384z" />
                      </svg>
                    </div>
                    <p className="sm:text-xl">Disclaimer</p>
                  </div>
                  <p className="pt-2 sm:text-sm text-xs">
                    We are NOT affiliated with DeGods, y00ts, Dust Labs, or any
                    other project… We are a few Web3 enthusiasts who wanted to
                    build something fun for the Solana ecosystem. We will do our
                    best not to rug you, but we can&apos;t make any guarantees.
                  </p>
                </div>
                <div className="bg-light px-6 sm:px-[20px] py-5 mt-6 text-left">
                  <div className="flex flex-row space-x-2 items-center">
                    <Image
                      src="/images/icons/dust.png"
                      height={30}
                      width={30}
                      alt="dust"
                    />
                    <p className="sm:text-xl">We only accept DUST</p>
                  </div>
                  <p className="pt-2 sm:text-sm text-xs">
                    DUST is a utility token that powers the DeGods universe.
                    DUST is not a financial instrument or investment vehicle.
                  </p>
                </div>
                {/* footer */}
                <div className="w-full py-8">
                  <button
                    className="text-red-500 font-bold underline"
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                    }}
                  >
                    CLOSE
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black" />
        </>
      ) : null}
    </>
  );
};

export default RulesModal;
