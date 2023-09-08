import {
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { getLoginStatus } from "@/utils";
import {
  WagerUserContext,
  WagerUserContextType,
} from "../stores/WagerUserStore";
import { motion } from "framer-motion";
import { smallClickAnimation } from "@/configs";

interface IconProps {
  fill: string;
}

export const BasketballIcon: FC<IconProps> = ({ fill }) => (
  <svg
    width={14}
    height={14}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
  >
    <path
      className={`fill-${fill}`}
      d="M86.6 64C119 35.5 158.6 15 202.3 5.6C206 19.1 208 33.3 208 48c0 38.4-13.5 73.7-36.1 101.3L86.6 64zM64 86.6l85.2 85.2C121.7 194.5 86.4 208 48 208c-14.7 0-28.9-2-42.4-5.7C15 158.6 35.5 119 64 86.6zM256 0c64.9 0 124.2 24.2 169.4 64L256 233.4 194.6 172C222.9 138.5 240 95.3 240 48c0-16.2-2-32-5.8-47.1C241.4 .3 248.7 0 256 0zM48 240c47.3 0 90.5-17.1 124-45.4L233.4 256 64 425.4C24.2 380.2 0 320.9 0 256c0-7.3 .3-14.6 .9-21.8C16 238 31.8 240 48 240zm463.1 37.8C496 274 480.2 272 464 272c-47.3 0-90.5 17.1-124 45.4L278.6 256 448 86.6c39.8 45.1 64 104.4 64 169.4c0 7.3-.3 14.6-.9 21.8zm-4.7 31.9C497 353.4 476.5 393 448 425.4l-85.2-85.2C390.3 317.5 425.6 304 464 304c14.7 0 28.9 2 42.4 5.7zM340.1 362.7L425.4 448C393 476.5 353.4 497 309.7 506.4C306 492.9 304 478.7 304 464c0-38.4 13.5-73.7 36.1-101.3zM317.4 340C289.1 373.5 272 416.7 272 464c0 16.2 2 32 5.8 47.1c-7.2 .6-14.5 .9-21.8 .9c-64.9 0-124.2-24.2-169.4-64L256 278.6 317.4 340z"
    />
  </svg>
);

export const FootballIcon: FC<IconProps> = ({ fill }) => (
  <svg
    width={14}
    height={14}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
  >
    <path
      className={`fill-${fill}`}
      d="M247.5 25.4c-13.5 3.3-26.4 7.2-38.6 11.7C142.9 61.6 96.7 103.6 66 153.6c-18.3 29.8-30.9 62.3-39.2 95.4L264.5 486.6c13.5-3.3 26.4-7.2 38.6-11.7c66-24.5 112.2-66.5 142.9-116.5c18.3-29.8 30.9-62.3 39.1-95.3L247.5 25.4zM495.2 205.3c6.1-56.8 1.4-112.2-7.7-156.4c-2.7-12.9-13-22.9-26.1-25.1c-58.2-9.7-109.9-12-155.6-7.9L495.2 205.3zM206.1 496L16.8 306.7c-6.1 56.8-1.4 112.2 7.7 156.4c2.7 12.9 13 22.9 26.1 25.1c58.2 9.7 109.9 12 155.6 7.9zm54.6-331.3c6.2-6.2 16.4-6.2 22.6 0l64 64c6.2 6.2 6.2 16.4 0 22.6s-16.4 6.2-22.6 0l-64-64c-6.2-6.2-6.2-16.4 0-22.6zm-48 48c6.2-6.2 16.4-6.2 22.6 0l64 64c6.2 6.2 6.2 16.4 0 22.6s-16.4 6.2-22.6 0l-64-64c-6.2-6.2-6.2-16.4 0-22.6zm-48 48c6.2-6.2 16.4-6.2 22.6 0l64 64c6.2 6.2 6.2 16.4 0 22.6s-16.4 6.2-22.6 0l-64-64c-6.2-6.2-6.2-16.4 0-22.6z"
    />
  </svg>
);

export const TrophyIcon: FC<IconProps> = ({ fill }) => (
  <svg
    width={14}
    height={14}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 576 512"
  >
    <path
      className={`fill-${fill}`}
      d="M400 0H176c-26.5 0-48.1 21.8-47.1 48.2c.2 5.3 .4 10.6 .7 15.8H24C10.7 64 0 74.7 0 88c0 92.6 33.5 157 78.5 200.7c44.3 43.1 98.3 64.8 138.1 75.8c23.4 6.5 39.4 26 39.4 45.6c0 20.9-17 37.9-37.9 37.9H192c-17.7 0-32 14.3-32 32s14.3 32 32 32H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H357.9C337 448 320 431 320 410.1c0-19.6 15.9-39.2 39.4-45.6c39.9-11 93.9-32.7 138.2-75.8C542.5 245 576 180.6 576 88c0-13.3-10.7-24-24-24H446.4c.3-5.2 .5-10.4 .7-15.8C448.1 21.8 426.5 0 400 0zM48.9 112h84.4c9.1 90.1 29.2 150.3 51.9 190.6c-24.9-11-50.8-26.5-73.2-48.3c-32-31.1-58-76-63-142.3zM464.1 254.3c-22.4 21.8-48.3 37.3-73.2 48.3c22.7-40.3 42.8-100.5 51.9-190.6h84.4c-5.1 66.3-31.1 111.2-63 142.3z"
    />
  </svg>
);

export const UsersIcon: FC<IconProps> = ({ fill }) => (
  <svg
    width={14}
    height={14}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 640 512"
  >
    <path
      className={`fill-${fill}`}
      d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM609.3 512H471.4c5.4-9.4 8.6-20.3 8.6-32v-8c0-60.7-27.1-115.2-69.8-151.8c2.4-.1 4.7-.2 7.1-.2h61.4C567.8 320 640 392.2 640 481.3c0 17-13.8 30.7-30.7 30.7zM432 256c-31 0-59-12.6-79.3-32.9C372.4 196.5 384 163.6 384 128c0-26.8-6.6-52.1-18.3-74.3C384.3 40.1 407.2 32 432 32c61.9 0 112 50.1 112 112s-50.1 112-112 112z"
    />
  </svg>
);

export const ManageIcon: FC<IconProps> = ({ fill }) => (
  <svg
    width={14}
    height={14}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
  >
    <path
      className={`fill-${fill}`}
      d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"
    />
  </svg>
);

export type ToggleConfig = {
  option1: {
    title: string;
    icon?: string;
  };
  option2: {
    title: string;
    icon?: string;
  };
  option3?: {
    title: string;
    icon?: string;
  };
  selected: "option1" | "option2" | "option3";
};

interface Props {
  toggleConfig: ToggleConfig;
  setToggleConfig: Dispatch<SetStateAction<ToggleConfig>>;
  view: "classic" | "pickem";
  ownsGame: boolean;
}

const ViewToggle: FC<Props> = ({
  toggleConfig,
  setToggleConfig,
  view,
  ownsGame,
}) => {
  const { wagerUser } = useContext(WagerUserContext) as WagerUserContextType;
  const [isAdmin, setIsAdmin] = useState(false);

  const handleClick = (tab: "option1" | "option2" | "option3") => {
    if (tab === "option3" && isAdmin === false) return;
    let newToggleConfig = { ...toggleConfig };
    if (toggleConfig.selected !== tab) {
      newToggleConfig.selected = tab;
    }
    setToggleConfig(newToggleConfig);
  };

  useEffect(() => {
    if ((wagerUser && wagerUser.roles.includes("ADMIN")) || ownsGame) {
      setIsAdmin(true);
    } else {
      handleClick("option1");
      setIsAdmin(false);
    }
  }, [wagerUser, ownsGame]);

  return (
    <>
      {/* desktop toggle */}
      <div className="absolute top-24 sm:top-8 left-1/2 -translate-x-1/2">
        <div className={`h-[38px] flex items-center gap-1 p-1 bg-greyscale1`}>
          <motion.button
            className={`${
              toggleConfig.selected === "option1"
                ? "bg-greyscale5 text-greyscale1"
                : "bg-transparent  hover:bg-greyscale2"
            } w-[80px] h-[30px] flex flex-col items-center justify-center`}
            onClick={() => handleClick("option1")}
          >
            {/* {view === "pickem" && (
              <FootballIcon
                fill={`${
                  toggleConfig.selected === "option1" ? "link" : "secondary"
                }`}
              />
            )}
            {view === "classic" && (
              <BasketballIcon
                fill={`${
                  toggleConfig.selected === "option1" ? "link" : "secondary"
                }`}
              />
            )} */}

            {toggleConfig.option1.title}
          </motion.button>
          <motion.button
            className={`${
              toggleConfig.selected === "option2"
                ? "bg-greyscale5 text-greyscale1"
                : "bg-transparent  hover:bg-greyscale2"
            } w-[80px] h-[30px] flex flex-col items-center justify-center`}
            onClick={() => handleClick("option2")}
          >
            {/* {view === "pickem" && (
              <TrophyIcon
                fill={`${
                  toggleConfig.selected === "option2" ? "link" : "secondary"
                }`}
              />
            )}
            {view === "classic" && (
              <UsersIcon
                fill={`${
                  toggleConfig.selected === "option2" ? "link" : "secondary"
                }`}
              />
            )} */}
            {toggleConfig.option2.title}
          </motion.button>
          {toggleConfig.option3 && isAdmin === true ? (
            <motion.button
              className={`${
                toggleConfig.selected === "option3"
                  ? "bg-greyscale5 text-greyscale1"
                  : "bg-transparent  hover:bg-greyscale2"
              } w-[80px] h-[30px] flex flex-col items-center justify-center`}
              onClick={() => handleClick("option3")}
            >
              {/* <ManageIcon
                fill={`${
                  toggleConfig.selected === "option3" ? "link" : "secondary"
                }`}
              /> */}
              {toggleConfig.option3.title}
            </motion.button>
          ) : null}
        </div>
      </div>

      {/* mobile toggle (tabs) */}
      {/* <div className="w-full lg:hidden mt-[1px] h-[50px]">
        <div className="w-full h-full bg-greyscale1 flex items-center justify-between px-[5px]">
          <div
            className={`${
              toggleConfig.selected === "option1"
                ? "border-b-2 border-purple1 text-purple1 font-base-b"
                : "text-greyscale4 font-base"
            } w-1/2 h-full flex flex-col items-center justify-center hover:cursor-pointer text-sm`}
            onClick={() => handleClick("option1")}
          >
            {toggleConfig.option1.title}
          </div>
          <div
            className={`${
              toggleConfig.selected === "option2"
                ? "border-b-2 border-purple1 text-purple1 font-base-b"
                : "text-greyscale4 font-base"
            } w-1/2 h-full flex flex-col items-center justify-center hover:cursor-pointer text-sm`}
            onClick={() => handleClick("option2")}
          >
            {toggleConfig.option2.title}
          </div>
          {toggleConfig.option3 && isAdmin === true ? (
            <div
              className={`${
                toggleConfig.selected === "option3" && isAdmin === true
                  ? "border-b-2 border-purple1 text-purple1 font-base-b"
                  : "text-greyscale4 font-base"
              } w-1/2 h-full flex flex-col items-center justify-center hover:cursor-pointer text-sm`}
              onClick={() => handleClick("option3")}
            >
              {toggleConfig.option3.title}
            </div>
          ) : null}
        </div>
      </div> */}
    </>
  );
};

export default ViewToggle;
