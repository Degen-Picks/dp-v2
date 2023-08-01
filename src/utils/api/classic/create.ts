import { generalConfig } from "@/configs";
import { LeaguesArray, League, TeamOption, ClassicGameOptions, ClassicGameCreateResponse, ClassicGameBody } from "@/types";
import { getAssets } from "@/utils";

function findTeamImage(
    assets: LeaguesArray,
    league: string,
    teamName: string,
    isCustom = -1
  ) {
    const leagueObj = assets.find((asset: League) => asset.league === league);
    if (!leagueObj) return "";
  
    if (isCustom !== -1) return leagueObj.options[isCustom].imageUrl;
  
    const teamObj = leagueObj.options.find(
      (option: TeamOption) => option.name === teamName
    );
    if (!teamObj) return "";
    return teamObj.imageUrl;
  }
  
  function findCollectionImage(assets: LeaguesArray, collection: string) {
    const leagueObj = assets.find((asset: League) => asset.league === collection);
    if (!leagueObj) return "";
  
    const randomIndex = Math.floor(Math.random() * leagueObj.options.length);
    return leagueObj.options[randomIndex].imageUrl;
  }
  
  function getMetadata(collection: string) {
    const metadata = [
      {
        collection: collection,
      },
      {
        is_hidden: false,
      },
    ];
  
    return metadata;
}
  
export default async function createClassic(
    options: ClassicGameOptions
  ): Promise<ClassicGameCreateResponse> {
    const assets = await getAssets();

    if(!assets) throw new Error("Error getting assets");

    const selection1img =
      options.league === "custom"
        ? findTeamImage(assets, options.league, options.team1Name, 0)
        : findTeamImage(assets, options.league, options.team1Name);
    const selection2img =
      options.league === "custom"
        ? findTeamImage(assets, options.league, options.team2Name, 1)
        : findTeamImage(assets, options.league, options.team2Name);

    const selection1nftImg = findCollectionImage(assets, options.collection);
    const selection2nftImg = findCollectionImage(assets, options.collection);
  
    const metadata = getMetadata(options.collection);
  
    const startDate = new Date().getTime() + 1000 * 60;
    const endDate = new Date(options.gameTime).getTime();
  
    const createBody: ClassicGameBody = {
      title: options.title,
      description: options.description || " ",
      selection1: options.team1Name,
      selection1Record: options.team1Record || " ",
      selection1img: selection1img,
      selection1winnerImg: " ",
      selection1nftImg: selection1nftImg,
      selection2: options.team2Name,
      selection2Record: options.team2Record || " ",
      selection2img: selection2img,
      selection2winnerImg: " ",
      selection2nftImg: selection2nftImg,
      startDate: startDate,
      endDate: endDate,
      gameDate: endDate,
      metadata: metadata,
    };
  
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const requestOptions: RequestInit = {
      method: "POST",
      headers: headers,
      body: JSON.stringify(createBody),
      credentials: "include",
    };
  
    const response = await fetch(
      `${generalConfig.apiUrl}/api/createWager`,
      requestOptions
    );
  
    const statusCode = response.status;
  
    const body = await response.json();
  
    if (statusCode === 403) throw new Error("Unauthorized");
  
    if (statusCode === 400) {
      throw new Error(body.message);
    }
  
    if (statusCode !== 200) throw new Error("Error creating game");
  
    return { statusCode, body };
  }