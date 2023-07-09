import dynamic from "next/dynamic";

// icons
const Discord = dynamic(() => import("./@icons/Discord"));
const Twitter = dynamic(() => import("./@icons/Twitter"));

// atoms
const ConnectButton = dynamic(() => import("./atoms/ConnectButton"));
const DataPoint = dynamic(() => import("./atoms/DataPoint"));
const FallbackImage = dynamic(() => import("./atoms/FallbackImage"));
const Footer = dynamic(() => import("./atoms/Footer"));
const Friend = dynamic(() => import("./atoms/Friend"));
const ImageShimmer = dynamic(() => import("./atoms/ImageShimmer"));
const RoadmapObject = dynamic(() => import("./atoms/RoadmapObject"));

// molecules
const Friends = dynamic(() => import("./molecules/Friends"));
const GameOptions = dynamic(() => import("./molecules/GameOptions"));
const Navbar = dynamic(() => import("./molecules/Navbar"));
const Roadmap = dynamic(() => import("./molecules/Roadmap"));
const TwitterLoginButton = dynamic(
  () => import("./molecules/TwitterLoginButton")
);

export {
  // icons
  Discord,
  Twitter,

  // atoms
  ConnectButton,
  DataPoint,
  FallbackImage,
  Footer,
  Friend,
  ImageShimmer,
  RoadmapObject,

  // molecules
  Friends,
  GameOptions,
  Navbar,
  Roadmap,
  TwitterLoginButton,
};
