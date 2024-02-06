import { FC } from "react";

interface Props {
  buttonText: string;
  disabled: boolean;
  handlePayToken: () => void;
}

const SuperbowlButton: FC<Props> = ({
  buttonText,
  disabled,
  handlePayToken,
}) => {
  return (
    <div className="superbowl-button-wrapper">
      <button
        className={`w-[153px] h-[50px] flex items-center justify-center rounded-[20px] ${
          disabled ? "bg-black" : "bg-transparent"
        }
        superbowl-button text-white disabled:cursor-not-allowed`}
        disabled={disabled}
        onClick={handlePayToken}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default SuperbowlButton;
