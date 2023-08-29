import { Dispatch, FC, SetStateAction } from "react";

interface Props {
  agree: boolean;
  setAgree: Dispatch<SetStateAction<boolean>>;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

const RulesCheckbox: FC<Props> = ({ agree, setAgree, setShowModal }) => {
  return (
    <div
      className="my-2 w-fit mr-auto text-left text-base sm:text-lg cursor-pointer flex items-center"
      onClick={() => setAgree(!agree)}
    >
      <input
        type="checkbox"
        checked={!!agree}
        onChange={() => setAgree(!agree)}
        className="mr-2 accent-link hover:accent-linkHover cursor-pointer 
        border-0 rounded-none w-5 h-5"
      />
      You agree to&nbsp;
      <span
        className="text-link hover:text-linkHover underline font-bold 
        hover:cursor-pointer transition-all duration-150"
        onClick={() => setShowModal(true)}
      >
        the rules
      </span>
      .
    </div>
  );
};

export default RulesCheckbox;
