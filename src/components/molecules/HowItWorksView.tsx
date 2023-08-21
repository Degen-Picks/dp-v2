import { FC } from "react";
import { ModalView } from "../organisms/RulesModal";

interface StepProps {
  num: number;
  instructions: string;
}

const RuleStep: FC<StepProps> = ({ num, instructions }) => (
  <div className="bg-light w-[155px] h-[85px] flex flex-col items-center justify-center">
    <p className="text-secondary text-sm">{`Step ${num}`}</p>
    <p className="text-primary text-center px-2 -mt-1">{instructions}</p>
  </div>
);

interface HowItWorksViewProps {
  modalView: ModalView;
}

const HowItWorksView: FC<HowItWorksViewProps> = ({ modalView }) => {
  return (
    <div
      className={`${modalView === ModalView.HowItWorks ? "block" : "hidden"}
      w-full pt-4 pb-8 text-center gap-5
      flex flex-col items-center justify-center`}
    >
      <p className="text-xl sm:text-2xl font-base-b text-center">
        How it works
      </p>
      <p className="max-w-[400px] mx-auto">
        Degen Picks™ is a peer-to-peer prediction game that uses the{" "}
        <a
          href="https://en.wikipedia.org/wiki/Parimutuel_betting"
          target="_blank"
          rel="noreferrer"
          className="underline text-link hover:text-linkHover"
        >
          parimutuel model
        </a>
        .
      </p>
      <div className="w-full flex items-center justify-center gap-4">
        <RuleStep num={1} instructions="Pick a side and make a wager" />
        <RuleStep num={2} instructions="Odds lock when the pool closes" />
        <RuleStep num={3} instructions="Payouts airdropped to winners" />
      </div>
    </div>
  );
};

export default HowItWorksView;
