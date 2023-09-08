import { FC, useEffect, useRef, useState } from "react";
import { InView } from "react-intersection-observer";

// fun count-up animations
const easeOutQuad = (t: number) => t * (2 - t);
const frameDuration = 1000 / 60;

interface AnimationProps {
  children: string;
  duration?: number;
}
const CountUpAnimation: FC<AnimationProps> = ({
  children,
  duration = 3000,
}) => {
  const countTo = parseInt(children, 10);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let frame = 0;
    const totalFrames = Math.round(duration / frameDuration);
    const counter = setInterval(() => {
      frame++;
      const progress = easeOutQuad(frame / totalFrames);
      setCount(countTo * progress);

      if (frame === totalFrames) {
        clearInterval(counter);
      }
    }, frameDuration);

    // cleanup function
    return () => clearInterval(counter);
  }, [countTo, duration]);

  return Math.floor(count);
};

interface Props {
  title: string;
  value: string;
}

const DataPoint: FC<Props> = ({ title, value }) => {
  const ref = useRef();

  return (
    <InView triggerOnce>
      {({ inView, ref }) => (
        <div
          className="flex flex-col items-center justify-center w-[260px] h-full p-2 m-3"
          ref={ref}
        >
          <p className="font-base-b text-lg text-data">
            {inView && <CountUpAnimation>{value}</CountUpAnimation>}
          </p>
          <p className="text-greyscale4">{title}</p>
        </div>
      )}
    </InView>
  );
};

export default DataPoint;
