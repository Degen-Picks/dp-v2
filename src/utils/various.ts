export const getUnixTs = () => {
  return new Date().getTime() / 1000;
};

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const getCurrencyIcon = (token: string | null) => {
  switch (token) {
    case "DUST":
      return "/images/icons/dust_square.svg";
    case "SOL":
      return "/images/icons/solana.svg";
    case "USDC":
      return "/images/icons/usdc.svg";
    default:
      return "/images/icons/dust_square.svg";
  }
};
