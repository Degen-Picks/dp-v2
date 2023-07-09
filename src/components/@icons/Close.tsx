import { FC, SVGAttributes } from "react";

export interface CloseProps extends SVGAttributes<SVGSVGElement> {}

const Close: FC<CloseProps> = ({ ...componentProps }: CloseProps) => (
  <svg
    width="14"
    height="15"
    {...componentProps}
    viewBox="0 0 14 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.76256 7.5L0.256282 1.60041L1.49372 0.274588L7 6.17418L12.5063 0.274588L13.7437 1.60041L8.23744 7.5L13.7437 13.3996L12.5063 14.7254L7 8.82582L1.49372 14.7254L0.256282 13.3996L5.76256 7.5Z"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.256282 0.274587C0.59799 -0.0915292 1.15201 -0.091529 1.49372 0.274588L7 6.17418L12.5063 0.274588C12.848 -0.091529 13.402 -0.0915292 13.7437 0.274587C14.0854 0.640704 14.0854 1.2343 13.7437 1.60041L8.23744 7.5L13.7437 13.3996C14.0854 13.7657 14.0854 14.3593 13.7437 14.7254C13.402 15.0915 12.848 15.0915 12.5063 14.7254L7 8.82582L1.49372 14.7254C1.15201 15.0915 0.59799 15.0915 0.256282 14.7254C-0.0854273 14.3593 -0.0854271 13.7657 0.256282 13.3996L5.76256 7.5L0.256282 1.60041C-0.0854271 1.2343 -0.0854273 0.640704 0.256282 0.274587Z"
    />
  </svg>
);

export default Close;
