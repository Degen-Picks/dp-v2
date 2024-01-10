import { Volume } from "@/types";
import Image from "next/image";

interface TokenDisplayProps {
    token: string;
    data: Volume[];
}
  
const TokenDisplay: React.FC<TokenDisplayProps> = ({ token, data }) => {
    // Function to find the amount for a specific token
    const getTokenAmount = (token: string, data: Volume[]) => {
      const foundToken = data.find((item) => item.token === token);
      return foundToken ? foundToken.amount : 0;
    };
  
    const amount = getTokenAmount(token, data);

    let imageName = token.toLowerCase();
    if (token === "SOL") imageName = "solana";
    if(token === "CROWN") imageName = "crown-logo";

    return (
      <div className="flex items-center gap-[5px]">
        <Image
          src={`/images/icons/${imageName}.png`}
          width={24}
          height={24}
          alt={token.toLowerCase()}
        />
        <p className="text-greyscale1 text-lg">
          {amount.toFixed(2)} <span className="text-greyscale4">{token}</span>
        </p>
      </div>
    );
  };
  
  export default TokenDisplay;