import { FC, useState } from "react";
import Navbar from "@/components/organisms/Navbar";
import SuperbowlRules from "@/components/organisms/SuperbowlRules";
import SuperbowlGame from "@/components/organisms/SuperbowlGame";
import SuperbowlStandings from "@/components/organisms/SuperbowlStandings";

export enum View {
  RULES = "Rules",
  GAME = "Game",
  STANDINGS = "Standings",
  ADMIN = "Admin",
}

const Superbowl: FC = () => {
  const [view, setView] = useState<View>(View.RULES);

  return (
    <div className="w-screen min-h-screen flex flex-col bg-greyscale6">
      <Navbar view={view} setView={setView} />
      <div className="w-full max-w-[620px] mx-auto flex flex-col flex-1 items-center">
        {view === View.RULES && <SuperbowlRules />}
        {view === View.GAME && <SuperbowlGame />}
        {view === View.STANDINGS && <SuperbowlStandings isAdmin={true} />}
        {view === View.ADMIN && <SuperbowlGame isAdmin={true} />}
      </div>
    </div>
  );
};

export default Superbowl;
