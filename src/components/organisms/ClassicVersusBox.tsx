import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { GameInfo } from "../../types/GameInfo";

interface TProps {
  active: boolean;
  teamImg: string;
  teamName: string;
  teamRecord: string;
  valid: boolean;
  success: boolean;
}

interface VProps {
  pickData: GameInfo;
  success: boolean;
  handlePicks: any;
  pickedTeams: any;
  valid: boolean;
  gameCompleted: boolean;
}

const TeamBox: FC<TProps> = ({
  active,
  teamImg,
  teamName,
  teamRecord,
  valid,
}) => (
  <div
    className={`sm:w-[249px] h-[100px] py-3 sm:py-0 sm:px-0 hover:cursor-pointer
    bg-${active ? "[#6E17FF/10]" : "light"} ${
      !valid && "sm:hover:cursor-not-allowed"
    }
    `}
  >
    <div className="flex flex-col text-center h-full justify-center w-fit mx-auto">
      <div className="mx-auto w-[35px] h-[35px]">
        <Image src={teamImg} width={30} height={30} alt={`${teamName} logo`} />
      </div>
      <div className="">
        <div
          className={`${
            active ? "font-base-b" : "font-base text-secondary"
          } text-center text-xs sm:text-base`}
        >
          {teamName}
        </div>
        <div
          className={`${
            active ? "font-base-b" : "font-base text-secondary"
          } text-[10px] sm:text-xs`}
        >
          {teamRecord}
        </div>
      </div>
    </div>
  </div>
);

const ClassicVersusBox: FC<VProps> = ({
  pickData,
  success,
  handlePicks,
  pickedTeams,
  valid,
  gameCompleted,
}) => {
  const [active1, setActive1] = useState<boolean>(false);
  const [active2, setActive2] = useState<boolean>(false);

  useEffect(() => {
    if (!success) return;

    if (pickedTeams.includes(pickData.team1.teamName)) {
      setActive1(true);
    } else if (pickedTeams.includes(pickData.team2.teamName)) {
      setActive2(true);
    }
  }, [pickedTeams]);

  return (
    <div className="w-full">
      <div className="w-full flex flex-row items-center justify-center relative">
        {/* left team */}
        <div
          // states:
          // 1. you haven't put a pick in yet and you set this pick to active = purple
          // 2. you haven't put a pick in yet and this pick is inactive (has not been clicked) = light grey
          // 3. you HAVE put a pick in and it was this one = dark grey
          // 4. you HAVE put a pick in and it was NOT this one = light grey
          // 5. you HAVE put a pick in and it was this one AND it was correct = green
          // 6. you HAVE put a pick in and it was this one AND it was incorrect = red
          className={`w-1/2 sm:w-auto border-2 ${
            !success
              ? active1
                ? "border-link bg-[rgba(110,23,255,0.1)]"
                : "border-transparent"
              : active1
              ? !gameCompleted
                ? "border-secondary !bg-border"
                : pickData.team1.winner
                ? "border-correct !bg-[#E8F5E9]"
                : "border-incorrect !bg-[#FFEBEE]"
              : "border-transparent"
          }`}
          // 5 - results are in + correct + active1 = green (border-correct bg-[#E8F5E9])
          // 6 - results are in + incorrect + active1 = red (border-incorrect bg-[#FFEBEE])

          onClick={() => {
            if (!success && valid) {
              if (active1) {
                setActive1(false);
                setActive2(false);
              } else {
                setActive1(true);
                setActive2(false);
              }

              // handlePicks(pickData.team1.teamName, id);
              handlePicks(1);
            }
          }}
        >
          <TeamBox
            active={active1}
            teamImg={pickData.team1.teamLogo}
            teamName={pickData.team1.teamName}
            teamRecord={pickData.team1.record}
            success={success}
            valid={valid}
          />
        </div>
        {/* right team */}
        <div
          className={`w-1/2 sm:w-auto border-2 ${
            !success
              ? active2
                ? "border-link bg-[rgba(110,23,255,0.1)]"
                : "border-transparent"
              : active2
              ? !gameCompleted
                ? "border-secondary !bg-border"
                : pickData.team2.winner
                ? "border-correct !bg-[#E8F5E9]"
                : "border-incorrect !bg-[#FFEBEE]"
              : "border-transparent"
          }`}
          onClick={() => {
            if (!success && valid) {
              if (active2) {
                setActive2(false);
                setActive1(false);
              } else {
                setActive2(true);
                setActive1(false);
              }

              // handlePicks(pickData.team2.teamName, id);
              handlePicks(2);
            }
          }}
        >
          <TeamBox
            active={active2}
            teamImg={pickData.team2.teamLogo}
            teamName={pickData.team2.teamName}
            teamRecord={pickData.team2.record}
            success={success}
            valid={valid}
          />
        </div>
        {/* vs icon absolutely positioned */}
        <div
          className="absolute bg-white rounded-full w-[25px] h-[25px]
          left-1/2 -translate-x-1/2 text-center"
        >
          <p className="h-full flex items-center justify-center text-xs text-secondary">
            vs
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClassicVersusBox;
