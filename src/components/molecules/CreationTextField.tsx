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
  type?: string;
  disabled?: boolean;
  limit?: number;
}

const CreationTextField: FC<Props> = ({
  gameDetails,
  setGameDetails,
  accessor,
  title,
  placeholder = "Enter text",
  fullWidth = true,
  textLeft = false,
  type = "text",
  disabled = false,
  limit,
}) => {
  const [initialized, setInitialized] = useState<boolean>(false);

  return (
    <div className={`relative h-[50px] ${fullWidth ? "w-full" : "w-[80px]"}`}>
      {title && (
        <p
          className="absolute -translate-x-[290px] w-[250px] top-1/2 -translate-y-1/2
          text-greyscale4 whitespace-nowrap text-right"
        >
          {title}
        </p>
      )}
      <form id="text-area" className="h-full">
        <input
          className={`w-full h-full bg-greyscale1 hover:bg-gray-50 placeholder:text-greyscale4
          flex items-center py-3 focus:outline-none border-2 border-transparent placeholder:opacity-100
          focus:border-purple1 disabled:cursor-not-allowed disabled:text-greyscale4
          ${accessor === "gameTime" && !initialized ? "text-greyscale4" : ""}
          ${textLeft ? "text-left px-4" : "text-center"}`}
          disabled={disabled}
          maxLength={limit ? limit : undefined}
          type={type}
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

export default CreationTextField;
