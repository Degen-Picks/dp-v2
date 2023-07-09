import { roadmap } from "@/configs";
import { RoadmapObject } from "@/components";
import Image from "next/image";

const Roadmap = () => {
  return (
    <div className="py-20 sm:pt-20 sm:pb-32 w-fit mx-auto px-10">
      <div className="text-left pb-10">
        <p className="font-bingodilan text-3xl">Roadmap</p>
        <p className="text-secondary text-xl pt-4">Hold onto your nips.</p>
      </div>
      <div className="border-l-2 border-black">
        {roadmap.map((item, index) => (
          <div className="flex justify-center my-6" key={index}>
            <div className="pt-6 pr-10 -translate-x-3">
              <Image
                src="/images/pickem/nipple.png"
                width={20}
                height={20}
                alt="nipple"
              />
            </div>
            <RoadmapObject
              title={item.title}
              description={item.description}
              state={item.state}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Roadmap;
