import { Profile } from './user';

export type TeamSlug =
  | 'buffalo-bills'
  | 'dallas-cowboys'
  | 'new-england-patriots'
  | 'tampa-bay-buccaneers'
  | 'kansas-city-chiefs'
  | 'los-angeles-rams'
  | 'indianapolis-colts'
  | 'arizona-cardinals'
  | 'cincinnati-bengals'
  | 'green-bay-packers'
  | 'tennessee-titans'
  | 'san-francisco-49ers'
  | 'philadelphia-eagles'
  | 'new-orleans-saints'
  | 'seattle-seahawks'
  | 'los-angeles-chargers'
  | 'denver-broncos'
  | 'minnesota-vikings'
  | 'baltimore-ravens'
  | 'cleveland-browns'
  | 'miami-dolphins'
  | 'pittsburgh-steelers'
  | 'las-vegas-raiders'
  | 'chicago-bears'
  | 'washington-commanders'
  | 'carolina-panthers'
  | 'detroit-lions'
  | 'atlanta-falcons'
  | 'new-york-giants'
  | 'houston-texans'
  | 'new-york-jets'
  | 'jacksonville-jaguars';

export type Matchup = {
  home: TeamSlug;
  away: TeamSlug;
  time: Date;
};

export type Schedule = {
  week: number;
  season: number;
  startDate: Date;
  endDate: Date;
  matchups: Matchup[];
};

export type FraudPicks = {
  id: number;
  createdAt: string;
  updatedAt: string;
  userId: Profile['id'];
  week: number;
  season: number;
  picks: TeamSlug[];
};

export type SimpleTeamData = {
  id: TeamSlug | string;
  name: string;
  wins: number;
  losses: number;
  ties: number;
  fraudValue: number;
  abbr: string;
};

export type FraudListResults = {
  createdAt: string;
  updatedAt: string;
  updatedBy: Profile['id'];
  week: number;
  season: number;
  losers: TeamSlug[];
};

export type FraudListWinnings = {
  userId: Profile['id'];
  winnings: number;
  week: number;
  season: number;
};
