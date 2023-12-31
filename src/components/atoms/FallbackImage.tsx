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
  const [finalWidth, setFinalWidth] = useState(width);
  const [finalHeight, setFinalHeight] = useState(height);

  const handleError = () => {
    setImageSrc(fallbackSrc);
    setFinalWidth(24);
    setFinalHeight(24);
  };

  return (
    <div className="rounded-full overflow-hidden">
      <img
        src={imageSrc}
        onError={handleError}
        width={finalWidth}
        height={finalHeight}
        alt={alt}
      />
    </div>
  );
};

export default FallbackImage;
