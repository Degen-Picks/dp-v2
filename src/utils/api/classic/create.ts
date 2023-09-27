import { generalConfig } from "@/configs";
import { ClassicGameOptions, ClassicGameCreateResponse, ClassicGameBody } from "@/types";
import { REVERSE_COLLECTION_NAME_MAP, REVERSE_LEAGUE_NAME_MAP } from "@/utils/nameMap";
  
export default async function createClassic(
    options: ClassicGameOptions
  ): Promise<ClassicGameCreateResponse> {
    const endDate = new Date(options.gameTime).getTime();

    const collectionName = REVERSE_COLLECTION_NAME_MAP[options.collection];
    if(!collectionName) throw new Error("Invalid collection name");

    const league = REVERSE_LEAGUE_NAME_MAP[options.league];
    if(!league) throw new Error("Invalid league name");
  
    const createBody: ClassicGameBody = {
      title: options.title,
      description: options.description || " ",
      league,
      collectionName,
      selection1: options.team1Name,
      selection1Record: options.team1Record || " ",
      selection2: options.team2Name,
      selection2Record: options.team2Record || " ",
      gameDate: endDate,
      token: options.token,
      info: options.info || " ",
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