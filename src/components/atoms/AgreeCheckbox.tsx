import { Dispatch, FC, SetStateAction } from "react";

interface Props {
  agree: boolean;
  setAgree: Dispatch<SetStateAction<boolean>>;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  disabled?: boolean;
}

const RulesCheckbox: FC<Props> = ({
  agree,
  setAgree,
  setShowModal,
  disabled = false,
}) => {
  return (
    <div
      className={`my-2 w-fit mr-auto text-left text-base sm:text-lg 
      ${!disabled && "cursor-pointer"} flex items-center`}
      onClick={() => !disabled && setAgree(!agree)}
    >
      <input
        type="checkbox"
        checked={!!agree}
        disabled={disabled}
        onChange={() => setAgree(!agree)}
        className="mr-2 accent-purple1 hover:accent-purple2 cursor-pointer 
        border-0 rounded-none w-5 h-5 disabled:cursor-not-allowed"
      />
      You agree to&nbsp;
      <span
        className="text-purple1 hover:text-purple2 underline font-bold 
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
