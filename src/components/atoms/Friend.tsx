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
        className="border border-container rounded-md hover:border-link overflow-hidden"
      />
    </a>
    <p className="text-center font-base-b group-hover:text-link">{name}</p>
    <p className="text-center">{type}</p>
  </div>
);

export default Friend;
