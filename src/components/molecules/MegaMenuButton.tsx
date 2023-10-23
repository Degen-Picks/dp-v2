import { FC } from "react";
import { WagerUser } from "@/types";
import { CaratDown, FallbackImage } from "@/components";
import { UserIcon } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";

interface Props {
  userData: WagerUser | undefined;
}

const MegaMenuButton: FC<Props> = ({ userData }) => {
  const { publicKey } = useWallet();

  if (!publicKey) return null;

  return (
    <div className="relative hover:bg-white hover:cursor-pointer w-[183px] h-[50px] px-2.5 py-[5px] flex items-center justify-center">
      <div className="w-full flex items-center gap-2.5">
        {!userData?.twitterData ? (
          <>
            <div className="w-10 h-10 flex items-center justify-center rounded-full border border-greyscale4">
              <UserIcon color="#A89FA8" />
            </div>
            <p className="text-lg whitespace-nowrap">
              {publicKey.toBase58().slice(0, 4) +
                " ... " +
                publicKey.toBase58().slice(-4)}
            </p>
          </>
        ) : (
          <>
            <FallbackImage
              src={userData?.twitterData!.profileImage}
              fallbackSrc={"/images/icons/user-alt.png"}
              width={33}
              height={33}
              alt="Twitter Profile Image"
            />
            <p className="text-lg">{userData?.twitterData!.username}</p>
          </>
        )}
        <div className="w-5 h-5 flex items-center justify-center">
          <CaratDown />
        </div>
      </div>
    </div>
  );
};

export default MegaMenuButton;
