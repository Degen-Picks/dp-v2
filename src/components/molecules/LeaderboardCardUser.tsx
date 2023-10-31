import { FC, useEffect } from "react";
import Image from "next/image";
import { WagerUser } from "@/types";
import { FallbackImage } from "@/components";

interface Props {
  user: WagerUser;
  title: string;
  dataTitle: string;
  dataValue: number;
}

const LeaderboardCardUser: FC<Props> = ({
  user,
  title,
  dataTitle,
  dataValue,
}) => {
  useEffect(() => {
    console.log(user);
  }, [user]);

  if (!user) return null;

  return (
    <div className="flex flex-col gap-2.5">
      <p>{title}</p>
      <div className="w-full sm:w-[300px] h-20 bg-greyscale1 flex items-center justify-between pl-5 py-2.5">
        <div className="flex items-center gap-2">
          {user.twitterData ? (
            <a
              href={`https://twitter.com/${user.twitterData.username}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2"
            >
              <div className="rounded-full w-[40px] h-[40px] overflow-hidden">
                <FallbackImage
                  src={user.twitterData.profileImage}
                  fallbackSrc={"/images/icons/user-alt.png"}
                  width={40}
                  height={40}
                  alt="user image"
                />
              </div>
              <p>{user.twitterData.username}</p>
            </a>
          ) : (
            <>
              <Image
                src="/images/icons/user-alt.png"
                width={40}
                height={40}
                alt="user image"
                className="rounded-full overflow-hidden"
              />
              <p>
                {user.publicKey.slice(0, 4) + "..." + user.publicKey.slice(-4)}
              </p>
            </>
          )}
        </div>
        <div className="w-20 h-[60px] flex items-center justify-center border-l border-greyscale4/50">
          <div className="flex flex-col items-center justify-center">
            {/* <p className="text-lg">{user?.points}</p> */}
            <p className="text-lg leading-5">{dataValue}</p>
            <p className="text-lg leading-5">{dataTitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardCardUser;
