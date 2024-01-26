import { FC } from "react";

interface Props {
  status: string;
  numPicks: number;
}

const SuperbowlButton: FC<Props> = ({ numPicks }) => {
  return (
    <button className="w-[160px] h-[50px] flex items-center justify-center superbowl-button text-white">
      Submit
    </button>
  );
};

export default SuperbowlButton;
