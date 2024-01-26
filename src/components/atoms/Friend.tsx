import { FC } from "react";
import { ImageShimmer } from "@/components";

interface Props {
  link: string;
  image: string;
  name: string;
  type: string;
}

const Friend: FC<Props> = ({ link, image, name, type }) => (
  <div className="flex flex-col flex-shrink-0 justify-center items-center group">
    <a href={link} target="_blank" rel="noreferrer">
      <ImageShimmer
        src={image}
        width={200}
        height={200}
        alt={name}
        className="border-2 border-greyscale6 hover:border-purple1 overflow-hidden"
      />
    </a>
    <p className="text-center font-base-b group-hover:text-purple1">{name}</p>
    <p className="text-center">{type}</p>
  </div>
);

export default Friend;
