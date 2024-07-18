import { generalConfig } from "@/configs";
import { GameInfo, ServerResponse, Team } from "@/types";

// export async function airdropClassic(
//     game: GameInfo,
//     winner: Team
//   ): Promise<ServerResponse> {
export async function airdropClassic(
    gameId: string,
    winnerId: string
  ): Promise<ServerResponse> {
    try {
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
  
      const requestOptions: RequestInit = {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          wagerId: gameId,
          selectionId: winnerId,
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
  