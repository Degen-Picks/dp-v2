import { Dispatch, FC, SetStateAction, useRef, useState } from "react";
import { useOutsideAlerter } from "../../hooks/useOutsideAlerter";

interface Props {
  activeFilter: boolean;
  setActiveFilter: Dispatch<SetStateAction<boolean>>;
}

const GameFilter: FC<Props> = ({ activeFilter, setActiveFilter }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuRef = useRef(null);
  useOutsideAlerter(menuRef, () => {
    setIsOpen(false);
  });

  return (
    <div className="w-[160px] h-[50px] relative z-50" ref={menuRef}>
      <div
        className="w-full h-full bg-white text-black flex items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-full flex items-center justify-evenly px-3">
          <p>{activeFilter ? "Active games" : "Past games"}</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="10"
            width="10"
            viewBox="0 0 512 512"
            className={`transform ${
              isOpen ? "rotate-180" : "rotate-0"
            } transition-transform duration-500 ease-in-out`}
          >
            <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
          </svg>
        </div>
      </div>
      <ul
        className={`${
          isOpen
            ? "animate-slide-down transition-height"
            : "animate-slide-up transition-height h-0"
        } overflow-hidden origin-top-right absolute right-0 w-full h-full 
        cursor-pointer shadow-lg bg-white`}
      >
        <li
          className={`${
            activeFilter && "hidden"
          } w-full hover:bg-slate-50 px-7 py-3`}
          onClick={() => {
            setActiveFilter(true);
            setIsOpen(false);
          }}
        >
          Active games
        </li>
        <li
          className={`${
            !activeFilter && "hidden"
          } w-full hover:bg-slate-50 px-7 py-3`}
          onClick={() => {
            setActiveFilter(false);
            setIsOpen(false);
          }}
        >
          Past games
        </li>
      </ul>
    </div>
  );
};

export default GameFilter;
