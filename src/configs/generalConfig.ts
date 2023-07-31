export const generalConfig = {
  // General repeatable values for project
  // Change to deployed base url (no slashes or protocols, EI: http: or https:)
  baseUrl: "degenpicks.xyz",
  apiUrl: "https://api.degenpicks.xyz",
  useDevAPI: true,
  useDevNet: true,

  tweetText(winningTeam: string, losingTeam: string, roundedBetAmount: string) {
    return `I picked ${winningTeam} to beat ${losingTeam} with ${roundedBetAmount} DUST on @degenpicksxyz \n\nMake your pick 👇 \n\ndegenpicks.xyz/classic`;
  },
  WALLET_SIGN_MESSAGE_LOGIN:
    "Sign this message to confirm ownership of your wallet. You will be prompted to link your Twitter.",
  WALLET_SIGN_MESSAGE_LOGOUT:
    "Sign this message to confirm ownership of your wallet. This will unlink your Twitter.",
};

generalConfig["apiUrl"] = generalConfig.useDevAPI
  ? "https://staging-api.degenpicks.xyz"
  : "https://api.degenpicks.xyz";
