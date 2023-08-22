import { FC } from "react";
import { WarningIcon } from "@/components";
import { ModalView } from "../organisms/RulesModal";

interface Props {
  modalView: ModalView;
}

const PlayResponsiblyView: FC<Props> = ({ modalView }) => {
  return (
    <div
      className={`${
        modalView === ModalView.PlayResponsibly ? "block" : "hidden"
      }
      w-full pt-4 pb-8 text-center gap-5
      flex flex-col items-center justify-center`}
    >
      <p className="text-xl sm:text-2xl font-base-b text-center">
        Play responsibly
      </p>
      <p className="max-w-[400px] mx-auto">
        Degen Picks™ pools are semi-trustless and community run, so make sure to
        DYOR.
      </p>
      <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4">
        <div className="w-[200px] flex flex-col items-start gap-4 text-lg">
          <div className="flex items-center gap-2">
            <WarningIcon />
            <p>All picks are final</p>
          </div>
          <div className="flex items-center gap-2">
            <WarningIcon />
            <p>1 pick per wallet</p>
          </div>
          <div className="flex items-center gap-2">
            <WarningIcon />
            <p>Odds are volatile</p>
          </div>
        </div>
        <div className="w-[200px] flex flex-col items-start gap-4">
          <div className="flex items-center gap-2">
            <WarningIcon />
            <p>6.9% platform fee</p>
          </div>
          <div className="flex items-center gap-2">
            <WarningIcon />
            <p>Losers get nothing</p>
          </div>
          <div className="flex items-center gap-2">
            <WarningIcon />
            <p>Beware of scams</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayResponsiblyView;
