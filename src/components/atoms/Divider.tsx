import { FC } from "react";

interface Props {
  color?: string;
  margin?: string;
}

const Divider: FC<Props> = ({ color = "#E0E0E0", margin = "16px" }) => (
  <div
    className="w-full h-[1px]"
    style={{ backgroundColor: color, marginTop: margin, marginBottom: margin }}
  />
);

export default Divider;
