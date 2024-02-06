import { DeIDData } from "@/types/DeIDData";

export const getUnixTs = () => {
  return new Date().getTime() / 1000;
};

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const getCurrencyIcon = (token: string | null) => {
  switch (token) {
    case "DUST":
      return "/images/icons/dust.png";
    case "SOL":
      return "/images/icons/solana.png";
    case "USDC":
      return "/images/icons/usdc.png";
    case "CROWN":
      return "/images/icons/crown-logo.png";
    default:
      return "/images/icons/dust.png";
  }
};

export const pickFee = 0.069;

function formatPublicKey(publicKey: string) {
  return `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`;
}

export const getUsernameFromDeID = (deid?: DeIDData, publicKey?: string) => {
  if(!deid && !publicKey) return null;
  if(!deid) return formatPublicKey(publicKey!);
  
  return (
    deid.twitterHandle || 
    deid.username ||
    deid.discordUsername || 
    ((deid.wallets?.length > 0 ) ?  formatPublicKey(deid.wallets[0].address) 
                                 : (publicKey ? formatPublicKey(publicKey) : null))
  );
};

export const getProfileImageFromDeID = (deid?: DeIDData) => {
  if(!deid) return "/images/icons/user-alt.svg";
  return deid.profileImage;
}