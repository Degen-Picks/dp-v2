import { useRouter } from "next/router";
import { FC } from "react";

const BackButton: FC = () => {
  const router = useRouter();

  return (
    <div
      className="flex items-center gap-2 cursor-pointer h-[50px] w-[100px] px-2 mx-3"
      onClick={() => router.back()}
    >
      <svg
        width="15"
        height="13"
        viewBox="0 0 15 13"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14.9688 7C14.9688 7.5625 14.5312 8 14 8H4.40625L7.6875 11.3125C8.09375 11.6875 8.09375 12.3438 7.6875 12.7188C7.5 12.9062 7.25 13 7 13C6.71875 13 6.46875 12.9062 6.28125 12.7188L1.28125 7.71875C0.875 7.34375 0.875 6.6875 1.28125 6.3125L6.28125 1.3125C6.65625 0.90625 7.3125 0.90625 7.6875 1.3125C8.09375 1.6875 8.09375 2.34375 7.6875 2.71875L4.40625 6H14C14.5312 6 14.9688 6.46875 14.9688 7Z"
          fill="#7808FF"
        />
      </svg>
      <p className="text-link font-base-b">Back</p>
    </div>
  );
};

export default BackButton;
