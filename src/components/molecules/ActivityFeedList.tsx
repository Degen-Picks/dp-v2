import { ActivityFeedItem } from '@/types/ActivityFeed';

type ActivityFeedListProps = {
  activityFeed: ActivityFeedItem[];
};

const ActivityFeedList = ({ activityFeed }: ActivityFeedListProps) => {
  return (
    <ul className="space-y-4">
      {activityFeed.map((activity) => (
        <li key={activity._id} className="flex items-center space-x-2">
          <img
            src={activity.event === 'win' ? '/path/to/trophy-icon.svg' : '/path/to/picked-icon.svg'}
            alt={activity.event === 'win' ? 'Trophy Icon' : 'Picked Icon'}
            className="w-6 h-6"
          />
          <div>
            <strong className="font-bold">{activity.user.deidData?.username || activity.user.deidData?.twitterHandle || activity.user._id}</strong>
            {activity.event === 'win' ? (
              <span className="text-green-500"> won {activity.amount} SOL</span>
            ) : (
              <span className="text-gray-500"> picked {activity.selection}</span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ActivityFeedList;