import dynamic from "next/dynamic";

// icons
const CaratDown = dynamic(() => import("./@icons/CaratDown"));
const Close = dynamic(() => import("./@icons/Close"));
const Crown = dynamic(() => import("./@icons/Crown"));
const Discord = dynamic(() => import("./@icons/Discord"));
const DiscordFooter = dynamic(() => import("./@icons/DiscordFooter"));
const ExternalLink = dynamic(() => import("./@icons/ExternalLink"));
const InfoIcon = dynamic(() => import("./@icons/InfoIcon"));
const QuestionIcon = dynamic(() => import("./@icons/QuestionIcon"));
const Twitter = dynamic(() => import("./@icons/Twitter"));
const TwitterFooter = dynamic(() => import("./@icons/TwitterFooter"));
const VerifiedBadge = dynamic(() => import("./@icons/VerifiedBadge"));
const WarningIcon = dynamic(() => import("./@icons/WarningIcon"));

// atoms
const AgreeCheckbox = dynamic(() => import("./atoms/AgreeCheckbox"));
const AlertBanner = dynamic(() => import("./atoms/AlertBanner"));
const AlertBanner2 = dynamic(() => import("./atoms/AlertBanner2"));
const BackButton = dynamic(() => import("./atoms/BackButton"));
const ConnectButton = dynamic(() => import("./atoms/ConnectButton"));
const DataBar = dynamic(() => import("./atoms/DataBar"));
const DataBarMobile = dynamic(() => import("./atoms/DataBarMobile"));
const DataPoint = dynamic(() => import("./atoms/DataPoint"));
const Divider = dynamic(() => import("./atoms/Divider"));
const FallbackImage = dynamic(() => import("./atoms/FallbackImage"));
const ForwardButton = dynamic(() => import("./atoms/ForwardButton"));
const Friend = dynamic(() => import("./atoms/Friend"));
const GameFilter = dynamic(() => import("./atoms/GameFilter"));
const ImageShimmer = dynamic(() => import("./atoms/ImageShimmer"));
const MovingData = dynamic(() => import("./atoms/MovingData"));
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
const CreationTextFieldLong = dynamic(
  () => import("./molecules/CreationTextFieldLong")
);
const Friends = dynamic(() => import("./molecules/Friends"));
const GameCard = dynamic(() => import("./molecules/GameCard"));
const GameMetadata = dynamic(() => import("./molecules/GameMetadata"));
const GameOptions = dynamic(() => import("./molecules/GameOptions"));
const HowItWorksView = dynamic(() => import("./molecules/HowItWorksView"));
const LeaderboardCardPool = dynamic(
  () => import("./molecules/LeaderboardCardPool")
);
const LeaderboardCardUser = dynamic(
  () => import("./molecules/LeaderboardCardUser")
);
const LinkTwitterView = dynamic(() => import("./molecules/LinkTwitterView"));
const MegaMenu = dynamic(() => import("./molecules/MegaMenu"));
const MegaMenuButton = dynamic(() => import("./molecules/MegaMenuButton"));
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
const VersusTeamBox = dynamic(() => import("./molecules/VersusTeamBox"));
const ViewToggle = dynamic(() => import("./molecules/ViewToggle"));

// organisms
const ClassicHero = dynamic(() => import("./organisms/ClassicHero"));
const ClassicVersusBox = dynamic(() => import("./organisms/ClassicVersusBox"));
const CreateModal = dynamic(() => import("./organisms/CreateModal"));
const InfoModal = dynamic(() => import("./organisms/InfoModal"));
const LeaderboardTable = dynamic(() => import("./organisms/LeaderboardTable"));
const ManageStats = dynamic(() => import("./organisms/ManageStats"));
const Navbar = dynamic(() => import("./organisms/Navbar"));
const PoolDetailsModal = dynamic(() => import("./organisms/PoolDetailsModal"));
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
  Crown,
  Discord,
  DiscordFooter,
  ExternalLink,
  InfoIcon,
  QuestionIcon,
  Twitter,
  TwitterFooter,
  VerifiedBadge,
  WarningIcon,

  // atoms
  AgreeCheckbox,
  AlertBanner,
  AlertBanner2,
  BackButton,
  ConnectButton,
  DataBar,
  DataBarMobile,
  DataPoint,
  Divider,
  FallbackImage,
  ForwardButton,
  Friend,
  GameFilter,
  ImageShimmer,
  MovingData,
  RoadmapObject,
  StepCircle,
  Timer,
  TwitterShare,

  // molecules
  ActivityItem,
  CreationDropMenu,
  CreationTextField,
  CreationTextFieldLong,
  Friends,
  GameCard,
  GameMetadata,
  GameOptions,
  HowItWorksView,
  LeaderboardCardPool,
  LeaderboardCardUser,
  LinkTwitterView,
  MegaMenu,
  MegaMenuButton,
  PlayResponsiblyView,
  RewardCircle,
  Roadmap,
  RunYourPoolView,
  TermsView,
  TwitterLoginButton,
  VersusTeamBox,
  ViewToggle,

  // organisms
  ClassicHero,
  ClassicVersusBox,
  CreateModal,
  InfoModal,
  LeaderboardTable,
  ManageStats,
  Navbar,
  PoolDetailsModal,
  RewardPool,
  RulesModal,

  // templates
  ActivityFeed,
  ClassicView,
  ManageGame,
};
