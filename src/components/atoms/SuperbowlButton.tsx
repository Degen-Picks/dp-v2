import { FC } from "react";

interface Props {
  status: string;
  numPicks: number;
  handlePayToken: () => void;
}

const SuperbowlButton: FC<Props> = ({ numPicks, handlePayToken }) => {
  return (
    <button
      className="w-[153px] h-[50px] flex items-center justify-center 
      superbowl-button text-white"
      onClick={handlePayToken}
    >
      Submit
    </button>
  );
};

export default SuperbowlButton;
