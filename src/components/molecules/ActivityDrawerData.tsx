import React from 'react';
import Image from 'next/image';
import { BetEventResponse } from "@/types";
import { getProfileImageFromDeID, getUsernameFromDeID } from '@/utils';

interface Props {
  data: BetEventResponse;
}

const ActivityDrawerData: React.FC<Props> = ({ data }) => {
  return (
    <div className="w-full max-w-md bg-greyscale7 text-greyscale1">
      <h2 className="text-[18px] font-bold mb-4">Activity/Personal Stats</h2>
      <div className="space-y-4">
        {data && data
          .filter(event => event.event !== "testevnet" && event.event !== "event")
          .map((event, index) => (
          <div key={event._id} className="flex items-center space-x-3">
            <div className="relative w-10 h-10">
              <Image
                src={getProfileImageFromDeID(event.user.deidData!)}
                alt={'User profile picture'}
                layout="fill"
                className="rounded-full"
              />
            </div>
            <div className="flex-grow">
              <p className="text-sm">
                <span className="font-semibold">
                  {getUsernameFromDeID(event.user.deidData!)}
                </span>
                {' '}
                {event.event === 'win' ? 'won' : 'picked'}{' '}
                {event.event === 'win' ? (
                  // TODO: Pull token type
                  <span className="text-green-400">+{event.amount} SOL</span> 
                ) : (
                  // TODO: Pull selection name
                  event.selection
                )}
              </p>
              <p className="text-xs text-greyscale4">
                {new Date(event.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityDrawerData;