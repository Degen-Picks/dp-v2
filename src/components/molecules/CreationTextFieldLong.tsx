import { Dispatch, FC, SetStateAction, useState } from "react";
import { ClassicGameOptions } from "../../types";

interface Props {
  gameDetails: ClassicGameOptions;
  setGameDetails: Dispatch<SetStateAction<ClassicGameOptions>>;
  accessor: keyof ClassicGameOptions;
  title?: string;
  placeholder?: string;
  fullWidth?: boolean;
  textLeft?: boolean;
  disabled?: boolean;
  limit?: number;
}

const CreationTextFieldLong: FC<Props> = ({
  gameDetails,
  setGameDetails,
  accessor,
  title,
  placeholder = "Enter text",
  fullWidth = true,
  textLeft = false,
  disabled = false,
  limit,
}) => {
  const [initialized, setInitialized] = useState<boolean>(false);

  return (
    <div className={`relative ${fullWidth ? "w-full" : "w-[80px]"}`}>
      {title && (
        <p
          className="absolute -translate-x-[290px] w-[250px] top-[12.5px]
          text-greyscale4 whitespace-nowrap text-right"
        >
          {title}
        </p>
      )}
      <form id="text-area">
        <textarea
          className={`w-full min-h-[50px] max-h-[400px] bg-greyscale1 hover:bg-gray-50 resize-y
          flex items-center py-3 focus:outline-none border-2 border-transparent
          focus:border-purple1 disabled:cursor-not-allowed disabled:text-disabled
          ${textLeft ? "text-left px-4" : "text-center"}`}
          disabled={disabled}
          maxLength={limit ? limit : undefined}
          onChange={(e) => {
            const newGameDetails: ClassicGameOptions = { ...gameDetails };
            newGameDetails[accessor] = e.target.value;
            setGameDetails(newGameDetails);
            setInitialized(true);
          }}
          onKeyDown={(e) => {
            setInitialized(true);
          }}
          value={gameDetails[accessor]}
          placeholder={placeholder}
        />
      </form>
    </div>
  );
};

export default CreationTextFieldLong;
