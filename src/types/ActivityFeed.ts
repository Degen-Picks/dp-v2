export type ActivityFeedItem = {
    user: {
      _id: string;
      deidData: {
        id: string;
        username: string;
        twitterHandle: string;
      } | null;
    };
    event: string;
    amount?: number;
    selection?: string;
    _id: string;
    timestamp: string;
    __v: number;
};