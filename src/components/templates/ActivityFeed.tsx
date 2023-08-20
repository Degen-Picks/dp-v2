import { useState, FC, useEffect } from "react";
import Image from "next/image";
import { ActivityItem, ClassicHero } from "@/components";
import { Activity, GameInfo } from "@/types";
import { generalConfig, smallClickAnimation } from "@/configs";
import { motion } from "framer-motion";
import { GameStatus } from "./ClassicView";
interface Props {
  gameData: GameInfo;
  gameStatus: GameStatus;
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

const getTeamName = (placedBet: any, gameData: GameInfo) => {
  console.log(placedBet, gameData);
  return placedBet.selectionId === gameData.team1.id
    ? gameData.team1.teamName
    : gameData.team2.teamName;
};

const getUserImage = (placedBet: any) => {
  if (placedBet.user && placedBet.user?.twitterData?.profileImage) {
    return placedBet.user.twitterData.profileImage;
  } else {
    return "/images/icons/user-alt.svg";
  }
};

const ActivityFeed: FC<Props> = ({ gameData, gameStatus }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activityRefresh, setActivityRefresh] = useState(false);
  const [page, setPage] = useState(1);

  const axios = require("axios");

  // TODO: Move to apiUtil
  const loadActivities = async () => {
    const ITEMS_PER_PAGE = 5;
    try {
      const response = await axios.post(
        `${generalConfig.apiUrl}/api/activityFeed`,
        {
          wagerId: gameData.gameInfo.id,
          limit: ITEMS_PER_PAGE,
          page: page,
        }
      );

      const placedBets = response.data.data.reverse();
      const data: Activity[] = [];

      let id = (page - 1) * ITEMS_PER_PAGE;

      for (const placedBet of placedBets) {
        const formatted = {
          id,
          name: getName(placedBet),
          time: dateFromObjectId(placedBet._id),
          dustBet: placedBet.amounts[0].amount,
          teamName: getTeamName(placedBet, gameData),
          teamImage: getTeamImage(placedBet, gameData),
          userImage: getUserImage(placedBet),
          twitterName: placedBet.user?.twitterData?.username,
        };

        data.push(formatted);
        id++;
      }

      if (activities !== data) {
        // this means that the data has changes
        setActivities([...data]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let interval: any = null;
    if (!activityRefresh) {
      setActivityRefresh(true);

      interval = setInterval(async () => {
        await loadActivities();

        if (gameStatus === GameStatus.OPEN) {
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
    <div className="w-full max-w-[620px] mx-auto pt-6 px-4 sm:px-0">
      {loading ? (
        <div className="w-fit mx-auto mt-20">
          {/* <div className="rotate">
            <Image
              src="/images/pickem/nipple.png"
              width={100}
              height={100}
              alt="nipple spinner"
            />
          </div> */}
          <p className="text-xl font-base text-center w-fit mx-auto py-10">
            Loading ...
          </p>
        </div>
      ) : (
        <>
          {/* logo section */}
          <div className="my-10">
            <ClassicHero gameData={gameData} gameStatus={gameStatus} />
          </div>
          {/* activity feed */}
          <div className="flex flex-col items-center gap-4 mb-8">
            {activities.map((item, index) => (
              <ActivityItem item={item} key={index} />
            ))}
          </div>
          {/* TODO: how to check if there are more activities? */}
          <motion.button
            {...smallClickAnimation}
            className="text-link"
            onClick={() => setPage(page + 1)}
          >
            Load More
          </motion.button>
        </>
      )}
    </div>
  );
};

export default ActivityFeed;
