import { FC } from "react";

interface Props {
  color?: string;
  margin?: string;
  width?: string;
}

const Divider: FC<Props> = ({ color = "#E0E0E0", margin = "16px", width }) => (
  <div
    className="h-[1px] px-10"
    style={{
      backgroundColor: color,
      marginTop: margin,
      marginBottom: margin,
      width: width ? width : "100%",
    }}
  />
);

export default Divider;
