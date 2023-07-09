import React, {
  FC,
  HTMLAttributes,
  useEffect,
  // useLayoutEffect,
  // useRef,
  useState,
} from "react";
import Image from "next/image";

interface Props extends HTMLAttributes<HTMLDivElement> {
  width: number;
  height: number;
  src: string;
  alt?: string;
  fill?: boolean;
}

const ImageShimmer: FC<Props> = ({
  width,
  height,
  src,
  className,
  alt,
  onLoad,
  fill,
}: Props) => {
  const [imageSrc, setImageSrc] = useState<string>(src);
  const shimmer = (w: number, h: number) => `
    <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
        <linearGradient id="g">
        <stop stop-color="#333" offset="20%" />
        <stop stop-color="#222" offset="50%" />
        <stop stop-color="#333" offset="70%" />
        </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="#333" />
    <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
    <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
    </svg>`;

  useEffect(() => {
    setImageSrc(src);
  }, [src]);

  const toBase64 = (str: string) =>
    typeof window === "undefined"
      ? Buffer.from(str).toString("base64")
      : window.btoa(str);

  return (
    <Image
      src={
        imageSrc === src
          ? imageSrc
          : `data:image/svg+xml;base64,${toBase64(shimmer(width, height))}`
      }
      placeholder="blur"
      blurDataURL={`data:image/svg+xml;base64,${toBase64(
        shimmer(width, height)
      )}`}
      {...(fill ? { fill: true } : { width: width, height: height })}
      className={className}
      alt={alt || "Shimmer Image"}
      onLoad={onLoad}
    />
  );
};

export default ImageShimmer;
