import { generalConfig } from "@/configs";
import { GameInfo, ServerResponse, Team } from "@/types";

export async function airdropClassic(
    game: GameInfo,
    winner: Team
  ): Promise<ServerResponse> {
    try {
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
  
      const requestOptions: RequestInit = {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          wagerId: game.gameInfo.id,
          selectionId: winner.id,
        }),
        credentials: "include",
      };
  
      const response = await fetch(
        `${generalConfig.apiUrl}/api/declareWinner`,
        requestOptions
      );
  
      const body = await response.json();
  
      return {
        success: response.status === 200,
        message: body.message,
      };
    } catch {
      return {
        success: false,
        message: "Error airdropping",
      };
    }
  }
  