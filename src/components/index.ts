import dynamic from "next/dynamic";

// icons
const CaratDown = dynamic(() => import("./@icons/CaratDown"));
const Close = dynamic(() => import("./@icons/Close"));
const Discord = dynamic(() => import("./@icons/Discord"));
const DiscordFooter = dynamic(() => import("./@icons/DiscordFooter"));
const QuestionIcon = dynamic(() => import("./@icons/QuestionIcon"));
const Twitter = dynamic(() => import("./@icons/Twitter"));
const TwitterFooter = dynamic(() => import("./@icons/TwitterFooter"));
const VerifiedBadge = dynamic(() => import("./@icons/VerifiedBadge"));
const WarningIcon = dynamic(() => import("./@icons/WarningIcon"));

// atoms
const AgreeCheckbox = dynamic(() => import("./atoms/AgreeCheckbox"));
const AlertBanner = dynamic(() => import("./atoms/AlertBanner"));
const BackButton = dynamic(() => import("./atoms/BackButton"));
const ConnectButton = dynamic(() => import("./atoms/ConnectButton"));
const DataPoint = dynamic(() => import("./atoms/DataPoint"));
const Divider = dynamic(() => import("./atoms/Divider"));
const FallbackImage = dynamic(() => import("./atoms/FallbackImage"));
const Footer = dynamic(() => import("./atoms/Footer"));
const ForwardButton = dynamic(() => import("./atoms/ForwardButton"));
const Friend = dynamic(() => import("./atoms/Friend"));
const GameFilter = dynamic(() => import("./atoms/GameFilter"));
const ImageShimmer = dynamic(() => import("./atoms/ImageShimmer"));
const RoadmapObject = dynamic(() => import("./atoms/RoadmapObject"));
const StepCircle = dynamic(() => import("./atoms/StepCircle"));
const Timer = dynamic(() => import("./atoms/Timer"));
const TwitterShare = dynamic(() => import("./atoms/TwitterShare"));

// molecules
const ActivityItem = dynamic(() => import("./molecules/ActivityItem"));
const CreationDropMenu = dynamic(() => import("./molecules/CreationDropMenu"));
const CreationTextField = dynamic(
  () => import("./molecules/CreationTextField")
);
const Friends = dynamic(() => import("./molecules/Friends"));
const GameMetadata = dynamic(() => import("./molecules/GameMetadata"));
const GameOptions = dynamic(() => import("./molecules/GameOptions"));
const HowItWorksView = dynamic(() => import("./molecules/HowItWorksView"));
const LinkTwitterView = dynamic(() => import("./molecules/LinkTwitterView"));
const MobileMenu = dynamic(() => import("./molecules/MobileMenu"));
const Navbar = dynamic(() => import("./molecules/Navbar"));
const PlayResponsiblyView = dynamic(
  () => import("./molecules/PlayResponsiblyView")
);
const RewardCircle = dynamic(() => import("./molecules/RewardCircle"));
const Roadmap = dynamic(() => import("./molecules/Roadmap"));
const RunYourPoolView = dynamic(() => import("./molecules/RunYourPoolView"));
const TermsView = dynamic(() => import("./molecules/TermsView"));
const TwitterLoginButton = dynamic(
  () => import("./molecules/TwitterLoginButton")
);
const ViewToggle = dynamic(() => import("./molecules/ViewToggle"));

// organisms
const ClassicHero = dynamic(() => import("./organisms/ClassicHero"));
const ClassicVersusBox = dynamic(() => import("./organisms/ClassicVersusBox"));
const CreateModal = dynamic(() => import("./organisms/CreateModal"));
const RewardPool = dynamic(() => import("./organisms/RewardPool"));
const RulesModal = dynamic(() => import("./organisms/RulesModal"));

// templates
const ActivityFeed = dynamic(() => import("./templates/ActivityFeed"));
const ClassicView = dynamic(() => import("./templates/ClassicView"));
const ManageGame = dynamic(() => import("./templates/ManageGame"));

export {
  // icons
  CaratDown,
  Close,
  Discord,
  DiscordFooter,
  QuestionIcon,
  Twitter,
  TwitterFooter,
  VerifiedBadge,
  WarningIcon,

  // atoms
  AgreeCheckbox,
  AlertBanner,
  BackButton,
  ConnectButton,
  DataPoint,
  Divider,
  FallbackImage,
  Footer,
  ForwardButton,
  Friend,
  GameFilter,
  ImageShimmer,
  RoadmapObject,
  StepCircle,
  Timer,
  TwitterShare,

  // molecules
  ActivityItem,
  CreationDropMenu,
  CreationTextField,
  Friends,
  GameMetadata,
  GameOptions,
  HowItWorksView,
  LinkTwitterView,
  MobileMenu,
  Navbar,
  PlayResponsiblyView,
  RewardCircle,
  Roadmap,
  RunYourPoolView,
  TermsView,
  TwitterLoginButton,
  ViewToggle,

  // organisms
  ClassicHero,
  ClassicVersusBox,
  CreateModal,
  RewardPool,
  RulesModal,

  // templates
  ActivityFeed,
  ClassicView,
  ManageGame,
};
