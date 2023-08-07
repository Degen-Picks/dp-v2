import { FC } from "react";

interface Props {
  text: string;
  ctaText?: string;
  ctaLink?: string;
}

const AlertBanner: FC<Props> = ({ text, ctaLink, ctaText }) => {
  return (
    <div className="w-full h-[60px] bg-[#FECE00] flex items-center justify-center gap-2">
      <p className="text-lg text-primary">{text}</p>
      {ctaLink && ctaText && (
        <a
          href={ctaLink}
          target="_blank"
          rel="noreferrer"
          className="text-lg text-primary underline"
        >
          {ctaText}
        </a>
      )}
    </div>
  );
};

export default AlertBanner;
