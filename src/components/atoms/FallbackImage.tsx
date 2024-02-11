import React, { FC, useState } from "react";

interface Props {
  src: string;
  fallbackSrc: string;
  width: number;
  height: number;
  alt: string;
}

const FallbackImage: FC<Props> = ({ src, fallbackSrc, width, height, alt }) => {
  const [imageSrc, setImageSrc] = useState(src);

  const handleError = () => {
    setImageSrc(fallbackSrc);
  };

  return (
    <div className="rounded-full overflow-hidden">
      <img
        src={imageSrc}
        onError={handleError}
        width={width}
        height={height}
        alt={alt}
      />
    </div>
  );
};

export default FallbackImage;
