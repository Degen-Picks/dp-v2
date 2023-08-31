export const COLLECTION_NAME_MAP: { [key: string]: string } = {
    'degods-S3-collection': 'DeGods III',
    'frank-collection': 'Frank',
    'madlads-collection': 'MadLads',
    'nippies-collection': 'Nippies',
    'degods-collection': 'DeGods II',
    'y00tletics-collection': 'y00tletics',
};

export const REVERSE_COLLECTION_NAME_MAP: { [key: string]: string } = 
    Object.fromEntries(Object.entries(COLLECTION_NAME_MAP).map(([k, v]) => [v, k]));

export const LEAGUE_NAME_MAP: { [key: string]: string } = {
    big3: 'Big3',
    mlb: 'MLB',
    nba: 'NBA',
    nfl: 'NFL',
    nhl: 'NHL',
    custom: 'Custom',
};

export const REVERSE_LEAGUE_NAME_MAP: { [key: string]: string } =
    Object.fromEntries(Object.entries(LEAGUE_NAME_MAP).map(([k, v]) => [v, k]));
      