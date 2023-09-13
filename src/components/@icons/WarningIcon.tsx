import { FC, SVGAttributes } from "react";

export interface WarningIconProps extends SVGAttributes<SVGSVGElement> {}

const WarningIcon: FC<WarningIconProps> = ({
  ...componentProps
}: WarningIconProps) => (
  <svg
    width="16"
    height="13"
    {...componentProps}
    viewBox="0 0 16 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.8359 11.1523C15.2734 11.918 14.7266 12.875 13.8242 12.875H2.14844C1.24609 12.875 0.699219 11.918 1.13672 11.1523L6.98828 1.19922C7.42578 0.433594 8.54688 0.433594 9.01172 1.19922L14.8359 11.1523ZM7.34375 4.34375V7.84375C7.34375 8.22656 7.67188 8.5 8 8.5C8.35547 8.5 8.65625 8.22656 8.65625 7.84375V4.34375C8.65625 3.98828 8.35547 3.6875 8 3.6875C7.61719 3.6875 7.34375 3.98828 7.34375 4.34375ZM8 11.125C8.46484 11.125 8.84766 10.7422 8.84766 10.2773C8.84766 9.8125 8.46484 9.42969 8 9.42969C7.50781 9.42969 7.125 9.8125 7.125 10.2773C7.125 10.7422 7.50781 11.125 8 11.125Z"
      fill="#E1233D"
    />
  </svg>
);

export default WarningIcon;
