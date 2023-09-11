import { FC } from "react";
import { WarningIcon } from "@/components";
import { CreateModalView } from "../organisms/CreateModal";

interface Props {
  modalView: CreateModalView;
}

const TermsView: FC<Props> = ({ modalView }) => {
  return (
    <div
      className={`${modalView === CreateModalView.Terms ? "block" : "hidden"}
      w-full pt-4 pb-8 text-center gap-5
      flex flex-col items-center justify-center`}
    >
      <p className="text-xl sm:text-2xl font-base-b text-center">
        Terms & conditions
      </p>
      <p className="max-w-[400px] mx-auto">
        A few things you should know before creating a Degen Picks™ pool.
      </p>
      <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4">
        <div className="w-[250px] flex flex-col items-start gap-4 text-lg">
          <div className="flex items-center gap-2">
            <WarningIcon />
            <p>Keep it clean</p>
          </div>
          <div className="flex items-center gap-2">
            <WarningIcon />
            <p>Airdrop winners</p>
          </div>
        </div>
        <div className="w-[250px] flex flex-col items-start gap-4">
          <div className="flex items-center gap-2">
            <WarningIcon />
            <p>Maximum (1) pool at a time</p>
          </div>
          <div className="flex items-center gap-2">
            <WarningIcon />
            <p>Take 50% of the fees</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsView;
