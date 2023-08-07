import { FC } from "react";

interface Props {
  text: string;
  ctaText?: string;
  ctaLink?: string;
}

const AlertBanner: FC<Props> = ({ text, ctaLink, ctaText }) => {
  return (
    <div className="w-full h-[60px] bg-[#FECE00] flex items-center justify-center text-center">
      <p className="text-lg text-primary leading-[19px] px-6 sm:px-0">
        {text}{" "}
        <span>
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
        </span>
      </p>
    </div>
  );
};

export default AlertBanner;
