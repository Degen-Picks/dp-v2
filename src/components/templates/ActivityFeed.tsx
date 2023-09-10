import { useState, FC, useEffect } from "react";
import { ActivityItem, ClassicHero, Divider, TwitterShare } from "@/components";
import { Activity, GameInfo } from "@/types";
import { generalConfig } from "@/configs";
import { GameStatus } from "./ClassicView";
import { FadeLoader } from "react-spinners";
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
    return "/images/icons/user-alt.png";
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
    await axios
      .post(`${generalConfig.apiUrl}/api/activityFeed`, {
        wagerId: gameData.gameInfo.id,
      })
      .then(function (response: any) {
        const placedBets = response.data.data.reverse();
        const data = [];
        let id = 0;

        for (const placedBet of placedBets) {
          const formatted: Activity = {
            id,
            name: getName(placedBet),
            time: dateFromObjectId(placedBet._id),
            dustBet: placedBet.amounts[0].amount,
            teamImage: getTeamImage(placedBet, gameData),
            teamName: getTeamName(placedBet, gameData),
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
        <div className="w-fit mx-auto flex flex-col items-center mt-20">
          <FadeLoader color="#651FFF" />
          <p className="text-xl font-base text-center w-fit mx-auto py-5 text-purple1">
            Loading ...
          </p>
        </div>
      ) : (
        <>
          {/* logo section */}
          <div className="mt-10 mb-[72px]">
            <ClassicHero gameData={gameData} gameStatus={gameStatus} />
          </div>
          {/* activity feed */}
          <div className="relative flex flex-col items-center gap-5 mb-8">
            <div className="absolute right-0 -top-12">
              <TwitterShare
                url={`https://app.degenpicks.xyz/${gameData.gameInfo.id}`}
              />
            </div>
            {activities.length > 0 ? (
              activities.map((item, index) => (
                <ActivityItem item={item} key={index} gameData={gameData} />
              ))
            ) : (
              <>
                <Divider color="#A89FA8" margin="1px" />
                <p className="text-xl font-base text-center w-fit mx-auto">
                  Nothing to see here...
                </p>
              </>
            )}
          </div>
          {/* TODO: how to check if there are more activities? */}
          {/* <motion.button
            {...smallClickAnimation}
            className="text-purple1"
            onClick={() => setPage(page + 1)}
          >
            Load More
          </motion.button> */}
        </>
      )}
    </div>
  );
};

export default ActivityFeed;
