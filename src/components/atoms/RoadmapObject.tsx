import Image from "next/image";
import { FC } from "react";

interface Props {
  title: string;
  description: string;
  state: string;
}

const RoadmapObject: FC<Props> = ({ title, description, state }) => (
  <div className="w-[220px] md:w-[540px] min-h-[135px] border border-border">
    <div className="h-full flex flex-col items-start justify-between px-5 py-5">
      <p className="text-xl font-base-b">{title}</p>
      <p className="text-base">{description}</p>
      <div className="flex items-center">
        {state === "Complete" && (
          <Image
            src="/images/icons/check.svg"
            width={14}
            height={15}
            alt="check"
          />
        )}
        <p
          className={`text-sm px-2 py-1
      ${state === "Complete" && "text-correct"}
      ${state === "In progress" && " bg-pending"}
      ${state === "Upcoming" && "text-greyscale4 bg-greyscale6"}
      `}
        >
          {state}
        </p>
      </div>
    </div>
  </div>
);

export default RoadmapObject;
