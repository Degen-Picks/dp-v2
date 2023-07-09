import { Dispatch, FC, SetStateAction } from "react";
import { ClassicGameOptions } from "../../types";

interface Props {
  gameDetails: ClassicGameOptions;
  setGameDetails: Dispatch<SetStateAction<ClassicGameOptions>>;
  accessor: string;
  title?: string;
  placeholder?: string;
  fullWidth?: boolean;
  textLeft?: boolean;
  type?: string;
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
}) => {
  return (
    <div className={`relative h-full ${fullWidth ? "w-full" : "w-[80px]"}`}>
      {title && (
        <p
          className="absolute -translate-x-[290px] w-[250px] top-1/2 -translate-y-1/2
        text-secondary whitespace-nowrap text-right"
        >
          {title}
        </p>
      )}
      <form id="text-area" className="h-full">
        <input
          className={`w-full h-full bg-white text-primary hover:bg-gray-50 
          flex items-center py-3 focus:outline-none border-2 border-transparent
          focus:border-link font-base-b
          ${textLeft ? "text-left px-4" : "text-center"}`}
          type={type}
          onChange={(e) => {
            const newGameDetails = { ...gameDetails };
            newGameDetails[accessor] = e.target.value;
            setGameDetails(newGameDetails);
          }}
          value={gameDetails[accessor]}
          placeholder={placeholder}
        />
      </form>
    </div>
  );
};

export default CreationTextField;
