interface Wallet {
    network: string;
    address: string;
}

export interface DeIDData {
    id: string;
    username: string;
    twitterHandle: string;
    profileImage: string;
    discordUsername: string;
    wallets: Wallet[];
    _id: string;
}
  