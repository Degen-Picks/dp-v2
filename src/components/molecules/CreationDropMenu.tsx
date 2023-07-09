import Image from "next/image";
import { ClassicGameOptions } from "../../types";
import { useOutsideAlerter } from "../../hooks/useOutsideAlerter";
import React, { Dispatch, FC, SetStateAction, useRef, useState } from "react";

interface Props {
  list: string[];
  gameDetails: ClassicGameOptions;
  setGameDetails: Dispatch<SetStateAction<ClassicGameOptions>>;
  accessor: string;
  title: string;
  placeholder?: string;
  disabled?: boolean;
  icon?: boolean;
}

const CreationDropMenu: FC<Props> = ({
  list,
  gameDetails,
  setGameDetails,
  accessor,
  title,
  placeholder = "-Select-",
  disabled = false,
  icon = false,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, () => setIsOpen(false));

  const clickHandler = (item: string) => {
    const newGameDetails = { ...gameDetails };
    newGameDetails[accessor] = item;
    setGameDetails(newGameDetails);
    setIsOpen(false);
  };

  const fetchIcon = (item: string) => {
    if (accessor === "token") {
      switch (item) {
        case "DUST":
          return "/images/icons/dust_square.svg";
        case "SOL":
          return "/images/icons/solana.svg";
      }
    } else if (accessor === "team1Name" || accessor === "team2Name") {
      // do stuff
    }
  };

  return (
    <div className="w-full relative">
      <p
        className="absolute -translate-x-[290px] w-[250px] top-1/2
        -translate-y-1/2 text-secondary whitespace-nowrap text-right"
      >
        {title}
      </p>
      <div className="w-full relative inline-block text-left" ref={wrapperRef}>
        <div>
          <button
            type="button"
            className="flex items-center justify-between w-full bg-white 
            px-4 py-2 font-base-b hover:bg-gray-50 focus:outline-none 
            focus:ring-2 disabled:hover:bg-white disabled:hover:cursor-not-allowed
            focus:ring-link focus:ring-offset-2 focus:ring-offset-gray-100"
            id="options-menu"
            aria-expanded="true"
            aria-haspopup="true"
            onClick={() => setIsOpen(!isOpen)}
            disabled={disabled}
          >
            {gameDetails[accessor] && gameDetails[accessor] !== "" ? (
              <div className="flex items-center gap-3">
                {icon && (
                  <Image
                    src={fetchIcon(gameDetails[accessor])}
                    width={30}
                    height={30}
                    alt="team or token icon"
                  />
                )}
                <p className="text-primary font-base-b">
                  {gameDetails[accessor]}
                </p>
              </div>
            ) : (
              <p className="text-disabled">{placeholder}</p>
            )}
            <svg
              className="h-5 w-5 flex items-center justify-center"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="black"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {isOpen && (
          <div className="w-full max-h-[200px] overflow-y-auto absolute right-0 z-[+1] mt-2 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
            <div
              className="py-1"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              {list.map((item, index) => (
                <button
                  key={index}
                  onClick={() => clickHandler(item)}
                  className="z-50 w-full bg-white px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  role="menuitem"
                >
                  <div className="flex items-center gap-3">
                    {icon && (
                      <Image
                        src={fetchIcon(item)}
                        width={30}
                        height={30}
                        alt="team or token icon"
                      />
                    )}
                    <p className="text-primary">{item}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreationDropMenu;
