import { FC, useState } from "react";
import Navbar from "@/components/organisms/Navbar";
import SuperbowlRules from "@/components/organisms/SuperbowlRules";
import SuperbowlGame from "@/components/organisms/SuperbowlGame";

export enum View {
  RULES = "Rules",
  GAME = "Game",
  STANDINGS = "Standings",
  ADMIN = "Admin",
}

const Superbowl: FC = () => {
  const [view, setView] = useState<View>(View.RULES);

  return (
    <div className="w-screen min-h-screen flex flex-col bg-superbowlBg">
      <Navbar view={view} setView={setView} />
      {view === View.RULES && <SuperbowlRules />}
      {view === View.GAME && <SuperbowlGame />}
    </div>
  );
};

export default Superbowl;
