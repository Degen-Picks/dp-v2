import { useState, FC, useEffect } from "react";
import Image from "next/image";
import { ActivityItem } from "@/components";
import { Activity, GameInfo } from "@/types";
import { generalConfig } from "@/configs";
interface Props {
  gameData: GameInfo;
}

const dateFromObjectId = (objectId: string) => {
  return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
};

const getName = (placedBet: any) => {
  if (placedBet.user && placedBet.user?.twitterData?.username) {
    return placedBet.user.twitterData.username;
  }

  let slice1 = placedBet.publicKey.slice(0, 4);
  let slice2 = placedBet.publicKey.slice(
    placedBet.publicKey.length - 4,
    placedBet.publicKey.length
  );
  return slice1 + "..." + slice2;
};

const getTeamImage = (placedBet: any, gameData: GameInfo) => {
  return placedBet.selectionId === gameData.team1.id
    ? gameData.team1.teamLogo
    : gameData.team2.teamLogo;
};

const getUserImage = (placedBet: any) => {
  if (placedBet.user && placedBet.user?.twitterData?.profileImage) {
    return placedBet.user.twitterData.profileImage;
  } else {
    return "/images/icons/user-alt.svg";
  }
};

const ActivityFeed: FC<Props> = ({ gameData }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activityRefresh, setActivityRefresh] = useState(false);

  const axios = require("axios");

  const loadActivities = async () => {
    await axios
      .post(`${generalConfig.apiUrl}/api/activityFeed`, {
        wagerId: gameData.gameInfo.id,
      })
      .then(function (response: any) {
        const placedBets = response.data.data.reverse();
        console.log("needs typing", response.data);
        const data = [];
        let id = 0;

        for (const placedBet of placedBets) {
          const formatted: Activity = {
            id,
            name: getName(placedBet),
            time: dateFromObjectId(placedBet._id),
            dustBet: placedBet.amounts[0].amount,
            teamImage: getTeamImage(placedBet, gameData),
            userImage: getUserImage(placedBet),
            twitterName: placedBet.user?.twitterData?.username,
          };

          data.push(formatted);
          id++;
        }
        if (activities !== data) {
          // this means that the data has changed
          setActivities(data);
        }
      })
      .catch(function (error: any) {
        console.log(error);
      });
  };

  useEffect(() => {
    let interval: any = null;
    if (!activityRefresh) {
      setActivityRefresh(true);

      interval = setInterval(async () => {
        await loadActivities();

        if (gameData.gameInfo.status !== "live") {
          clearInterval(interval);
        }
      }, 5000);
    }

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchActivity = async () => {
      await loadActivities();
      setLoading(false);
    };

    fetchActivity();
  }, []);

  return (
    <div className="activity-feed">
      {loading ? (
        <div className="w-fit mx-auto mt-20">
          <div className="rotate">
            <Image
              src="/images/pickem/nipple.png"
              width={100}
              height={100}
              alt="nipple spinner"
            />
          </div>
          <p className="text-xl font-pressura text-center w-fit mx-auto py-10">
            Loading ...
          </p>
        </div>
      ) : (
        <>
          {/* logo section */}
          <div className="my-8 pb-10 lg:pb-0">
            <div className="w-fit mx-auto lg:mb-0">
              <div className=" font-pressura text-center">Picks Classic</div>
              <div className="font-bingodilan text-center text-3xl text-black">
                Activity Feed
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 mb-8">
            {activities.map((item, index) => (
              <ActivityItem item={item} key={index} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ActivityFeed;
