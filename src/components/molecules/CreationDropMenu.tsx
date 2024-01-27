import Image from "next/image";
import { ClassicGameOptions, League } from "../../types";
import { useOutsideAlerter } from "../../hooks/useOutsideAlerter";
import CaratDown from "../@icons/CaratDown";
import { Dispatch, FC, SetStateAction, useRef, useState } from "react";

interface Props {
  league: League | undefined;
  list: string[];
  gameDetails: ClassicGameOptions;
  setGameDetails: Dispatch<SetStateAction<ClassicGameOptions>>;
  accessor: keyof ClassicGameOptions;
  title: string;
  placeholder?: string;
  disabled?: boolean;
  icon?: boolean;
}

// TODO: make icon func global

const CreationDropMenu: FC<Props> = ({
  league,
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
    const newGameDetails: ClassicGameOptions = { ...gameDetails };
    newGameDetails[accessor as keyof ClassicGameOptions] = item;
    setGameDetails(newGameDetails);
    setIsOpen(false);
  };

  // TODO: abstract this function
  const fetchIcon = (item: string) => {
    var urlPath: string = "";
    if (accessor === "token") {
      switch (item) {
        case "DUST":
          urlPath = "/images/icons/dust.png";
          break;
        case "SOL":
          urlPath = "/images/icons/solana.png";
          break;
        case "USDC":
          urlPath = "/images/icons/usdc.png";
          break;
        case "CROWN":
          return "/images/icons/crown-logo.png";
        default:
          urlPath = "/images/icons/dust.png";
          break;
      }
    } else if (accessor === "team1Name" || accessor === "team2Name") {
      urlPath =
        league?.options?.find((team) => team.name === item)?.imageUrl ?? "";
    }
    return urlPath;
  };

  return (
    <div className="w-full relative">
      <p
        className="absolute -translate-x-[290px] w-[250px] top-1/2
        -translate-y-1/2 text-greyscale4 whitespace-nowrap text-right"
      >
        {title}
      </p>
      <div className="w-full relative inline-block text-left" ref={wrapperRef}>
        <button
          type="button"
          className="flex items-center justify-between w-full h-[50px]
          bg-greyscale1 px-4 py-2 hover:bg-gray-50 focus:outline-none 
          focus:ring-2 disabled:hover:bg-greyscale1 disabled:hover:cursor-not-allowed
          focus:ring-purple1"
          id="options-menu"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
        >
          {gameDetails[accessor as keyof ClassicGameOptions] &&
          gameDetails[accessor as keyof ClassicGameOptions] !== "" ? (
            <div className="flex items-center gap-3">
              {icon &&
                fetchIcon(
                  gameDetails[accessor as keyof ClassicGameOptions] as string
                ) !== "" && (
                  <Image
                    src={fetchIcon(
                      gameDetails[
                        accessor as keyof ClassicGameOptions
                      ] as string
                    )}
                    width={30}
                    height={30}
                    alt="team or token icon"
                  />
                )}
              <p className="">
                {gameDetails[accessor as keyof ClassicGameOptions]}
              </p>
            </div>
          ) : (
            <p className="text-disabled">{placeholder}</p>
          )}
          <CaratDown
            className={`mr-2 ${disabled ? "fill-disabled" : "fill-greyscale6"}`}
          />
        </button>

        {isOpen && (
          <div className="w-full max-h-[200px] overflow-y-auto absolute right-0 z-[+1] mt-2 origin-top-right rounded-md bg-greyscale1 shadow-lg ring-1 ring-black ring-opacity-5">
            <div
              className="py-1"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              {list?.map((item, index) => (
                <button
                  key={index}
                  onClick={() => clickHandler(item)}
                  className="z-50 w-full bg-greyscale1 px-4 py-2 text-left text-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900"
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
                    <p className="">{item}</p>
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
