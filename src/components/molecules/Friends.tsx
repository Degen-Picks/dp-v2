import { Friend } from "@/components";

const Friends = () => (
  <div className="my-12 pb-10 max-w-[1000px] mx-auto">
    <div className="font-bingodilan text-3xl text-black text-center pt-16">
      Built different by the DeGods community
    </div>
    <p className="text-center text-secondary text-xl py-8">and friends.</p>
    <div className="flex overflow-x-scroll gap-3 lg:gap-6 mb-4 py-6 px-10 lg:px-0">
      <Friend
        link="https://twitter.com/NinetiesNFT"
        image="/images/friends/1.nineties.png"
        name="Nineties"
        type="COO"
      />
      <Friend
        link="https://twitter.com/0x_saddy"
        image="/images/friends/2.saddy.png"
        name="Saddy"
        type="Product lead"
      />
      <Friend
        link="https://twitter.com/misterholana"
        image="/images/friends/3.h.png"
        name="h_"
        type="Founding dev"
      />
      <Friend
        link="https://twitter.com/matt_degods"
        image="/images/friends/4.matt.png"
        name="Matt"
        type="Founding dev"
      />
      <Friend
        link="https://twitter.com/Nippies_"
        image="/images/friends/5.nippies.png"
        name="Nippies"
        type="OG featured collection"
      />
      <Friend
        link="https://twitter.com/JustJB"
        image="/images/friends/6.jb.png"
        name="JB"
        type="Head of degeneracy"
      />
      <Friend
        link="https://twitter.com/glxsscircus"
        image="/images/friends/7.hammer.png"
        name="Hammer"
        type="Dark horse"
      />
      <Friend
        link="https://twitter.com/MickeyDegods"
        image="/images/friends/8.mickey.png"
        name="Mickey Degods"
        type="Supporter"
      />
      <Friend
        link="https://twitter.com/y00tsathletics"
        image="/images/friends/9.y00tletics.png"
        name="y00tletics"
        type="Supporter"
      />
      <Friend
        link="https://twitter.com/RippityDoo"
        image="/images/friends/10.rippity.png"
        name="Rippity Doo"
        type="Artwork"
      />
      <Friend
        link="https://twitter.com/ScubaSteveArt"
        image="/images/friends/11.scuba.png"
        name="Scuba Steve"
        type="Artwork"
      />
      <Friend
        link="https://twitter.com/ronansavaza_"
        image="/images/friends/12.vaztified.png"
        name="Vaz.tified"
        type="Artwork"
      />
    </div>
    {/* <div className="pt-6 sm:pt-12  text-center">
      Interested in a collab? Reach out to a team member on{" "}
      <a
        href="https://discord.gg/TGTam7epH6"
        target="_blank"
        rel="noreferrer"
        className="underline text-link lg:hover:text-linkHover"
      >
        Discord
      </a>
      .
    </div> */}
  </div>
);

export default Friends;
