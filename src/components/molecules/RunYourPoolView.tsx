import { FC } from "react";
import { CreateModalView } from "../organisms/CreateModal";

interface StepProps {
  num: number;
  instructions: string;
}

const RuleStep: FC<StepProps> = ({ num, instructions }) => (
  <div className="bg-greyscale3 w-full md:w-[155px] h-[85px] flex flex-col items-center justify-center">
    <p className="text-greyscale4 text-sm">{`Step ${num}`}</p>
    <p className=" text-center px-2 -mt-1">{instructions}</p>
  </div>
);

interface RunYourPoolProps {
  modalView: CreateModalView;
}

const RunYourPool: FC<RunYourPoolProps> = ({ modalView }) => {
  return (
    <div
      className={`${
        modalView === CreateModalView.RunYourPool ? "block" : "hidden"
      }
      w-full pt-4 pb-8 text-center gap-5
      flex flex-col items-center justify-center`}
    >
      <p className="text-xl sm:text-2xl font-base-b text-center">
        Run your own pool
      </p>
      <p className="max-w-[400px] mx-auto">
        Now you can run your own Degen Picks™ pool, and get 50% of the fees.
      </p>
      <div className="w-full flex flex-col md:flex-row items-center justify-center gap-4">
        <RuleStep num={1} instructions="Create a game" />
        <RuleStep num={2} instructions="Share it with friends" />
        <RuleStep num={3} instructions="Set winner to deploy airdrops" />
      </div>
    </div>
  );
};

export default RunYourPool;
