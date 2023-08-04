import dynamic from "next/dynamic";

// icons
const Close = dynamic(() => import("./@icons/Close"));
const Discord = dynamic(() => import("./@icons/Discord"));
const Twitter = dynamic(() => import("./@icons/Twitter"));
const QuestionIcon = dynamic(() => import("./@icons/QuestionIcon"));
const VerifiedBadge = dynamic(() => import("./@icons/VerifiedBadge"));

// atoms
const BackButton = dynamic(() => import("./atoms/BackButton"));
const ConnectButton = dynamic(() => import("./atoms/ConnectButton"));
const DataPoint = dynamic(() => import("./atoms/DataPoint"));
const Divider = dynamic(() => import("./atoms/Divider"));
const FallbackImage = dynamic(() => import("./atoms/FallbackImage"));
const Footer = dynamic(() => import("./atoms/Footer"));
const Friend = dynamic(() => import("./atoms/Friend"));
const GameFilter = dynamic(() => import("./atoms/GameFilter"));
const ImageShimmer = dynamic(() => import("./atoms/ImageShimmer"));
const RoadmapObject = dynamic(() => import("./atoms/RoadmapObject"));
const Timer = dynamic(() => import("./atoms/Timer"));

// molecules
const ActivityItem = dynamic(() => import("./molecules/ActivityItem"));
const CreationDropMenu = dynamic(() => import("./molecules/CreationDropMenu"));
const CreationTextField = dynamic(
  () => import("./molecules/CreationTextField")
);
const Friends = dynamic(() => import("./molecules/Friends"));
const GameOptions = dynamic(() => import("./molecules/GameOptions"));
const Navbar = dynamic(() => import("./molecules/Navbar"));
const RewardCircle = dynamic(() => import("./molecules/RewardCircle"));
const Roadmap = dynamic(() => import("./molecules/Roadmap"));
const RulesModal = dynamic(() => import("./molecules/RulesModal"));
const TwitterLoginButton = dynamic(
  () => import("./molecules/TwitterLoginButton")
);
const ViewToggle = dynamic(() => import("./molecules/ViewToggle"));

// organisms
const ClassicVersusBox = dynamic(() => import("./organisms/ClassicVersusBox"));
const RewardPool = dynamic(() => import("./organisms/RewardPool"));

// templates
const ActivityFeed = dynamic(() => import("./templates/ActivityFeed"));
const ClassicView = dynamic(() => import("./templates/ClassicView"));
const ManageGame = dynamic(() => import("./templates/ManageGame"));

export {
  // icons
  Close,
  Discord,
  Twitter,
  QuestionIcon,
  VerifiedBadge,

  // atoms
  BackButton,
  ConnectButton,
  DataPoint,
  Divider,
  FallbackImage,
  Footer,
  Friend,
  GameFilter,
  ImageShimmer,
  RoadmapObject,
  Timer,

  // molecules
  ActivityItem,
  CreationDropMenu,
  CreationTextField,
  Friends,
  GameOptions,
  Navbar,
  RewardCircle,
  Roadmap,
  RulesModal,
  TwitterLoginButton,
  ViewToggle,

  // organisms
  ClassicVersusBox,
  RewardPool,

  // templates
  ActivityFeed,
  ClassicView,
  ManageGame,
};
