import dynamic from "next/dynamic";

// icons
const Discord = dynamic(() => import("./@icons/Discord"));
const Twitter = dynamic(() => import("./@icons/Twitter"));

// atoms
const BackButton = dynamic(() => import("./atoms/BackButton"));
const ConnectButton = dynamic(() => import("./atoms/ConnectButton"));
const DataPoint = dynamic(() => import("./atoms/DataPoint"));
const FallbackImage = dynamic(() => import("./atoms/FallbackImage"));
const Footer = dynamic(() => import("./atoms/Footer"));
const Friend = dynamic(() => import("./atoms/Friend"));
const GameFilter = dynamic(() => import("./atoms/GameFilter"));
const ImageShimmer = dynamic(() => import("./atoms/ImageShimmer"));
const RoadmapObject = dynamic(() => import("./atoms/RoadmapObject"));
const Timer = dynamic(() => import("./atoms/Timer"));

// molecules
const CreationDropMenu = dynamic(() => import("./molecules/CreationDropMenu"));
const CreationTextField = dynamic(
  () => import("./molecules/CreationTextField")
);
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
  BackButton,
  ConnectButton,
  DataPoint,
  FallbackImage,
  Footer,
  Friend,
  GameFilter,
  ImageShimmer,
  RoadmapObject,
  Timer,

  // molecules
  CreationDropMenu,
  CreationTextField,
  Friends,
  GameOptions,
  Navbar,
  Roadmap,
  TwitterLoginButton,
};
