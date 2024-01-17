export type BinaryPick = 1 | 2 | null;

export type SuperbowlOption = {
  title: string;
  _id: string;
}

export type SuperbowlGameCard = {
  [key: string]: {
    title: string;
    answer: string | null;
    option1?: SuperbowlOption;
    option2?: SuperbowlOption;
  };
};
