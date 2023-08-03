import { generalConfig } from "@/configs";
import { LeaguesArray, League, TeamOption, ClassicGameOptions, ClassicGameCreateResponse, ClassicGameBody } from "@/types";
import { getAssets } from "@/utils";

function getMetadata() {
    const metadata = [
      {
        is_hidden: false,
      },
    ];
  
    return metadata;
}
  
export default async function createClassic(
    options: ClassicGameOptions
  ): Promise<ClassicGameCreateResponse> {
    const metadata = getMetadata();
  
    const startDate = new Date().getTime() + 1000 * 60;
    const endDate = new Date(options.gameTime).getTime();
  
    const createBody: ClassicGameBody = {
      title: options.title,
      description: options.description || " ",
      league: options.league,
      collectionName: options.collection,
      selection1: options.team1Name,
      selection1Record: options.team1Record || " ",
      selection2: options.team2Name,
      selection2Record: options.team2Record || " ",
      startDate: startDate,
      endDate: endDate,
      gameDate: endDate,
      token: options.token,
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