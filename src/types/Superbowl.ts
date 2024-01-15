export type BinaryPick = 1 | 2 | null;

export type SuperbowlGameCard = {
  anthem: {
    title: string;
    answer: BinaryPick;
    option1: string;
    option2: string;
  };
  coinToss: {
    title: string;
    answer: BinaryPick;
    option1: string;
    option2: string;
  };
  firstScore: {
    title: string;
    answer: BinaryPick;
    option1: string;
    option2: string;
  };
  halftime: {
    title: string;
    answer: BinaryPick;
    option1: string;
    option2: string;
  };
  gameWinner: {
    title: string;
    answer: BinaryPick;
    option1: string;
    option2: string;
  };
  tiebreaker: {
    title: string;
    answer: string;
  };
};
