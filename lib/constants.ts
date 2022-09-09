import { TeamSlug } from 'types/football';

export const roles = {
  admin: 16,
  moderator: 8,
  editor: 4,
  subscriber: 2,
  user: 1,
  banned: 0,
} as const;

export const abbrLookup: Record<TeamSlug, string> = {
  'buffalo-bills': 'BUF',
  'dallas-cowboys': 'DAL',
  'new-england-patriots': 'NE',
  'tampa-bay-buccaneers': 'TB',
  'kansas-city-chiefs': 'KC',
  'los-angeles-rams': 'LAR',
  'indianapolis-colts': 'IND',
  'arizona-cardinals': 'ARI',
  'cincinnati-bengals': 'CIN',
  'green-bay-packers': 'GB',
  'tennessee-titans': 'TEN',
  'san-francisco-49ers': 'SF',
  'philadelphia-eagles': 'PHI',
  'new-orleans-saints': 'NO',
  'seattle-seahawks': 'SEA',
  'los-angeles-chargers': 'LAC',
  'denver-broncos': 'DEN',
  'minnesota-vikings': 'MIN',
  'baltimore-ravens': 'BAL',
  'cleveland-browns': 'CLE',
  'miami-dolphins': 'MIA',
  'pittsburgh-steelers': 'PIT',
  'las-vegas-raiders': 'LV',
  'chicago-bears': 'CHI',
  'washington-commanders': 'WAS',
  'carolina-panthers': 'CAR',
  'detroit-lions': 'DET',
  'atlanta-falcons': 'ATL',
  'new-york-giants': 'NYG',
  'houston-texans': 'HOU',
  'new-york-jets': 'NYJ',
  'jacksonville-jaguars': 'JAX',
};
