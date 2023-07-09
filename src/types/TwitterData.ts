export interface TwitterObject {
  _id: string;
  publicKey: string;
  __v: number;
  twitterData: TwitterData;
}

export interface TwitterData {
  id: string;
  username: string;
  displayName: string;
  profileImage: string;
  _id: string;
}
