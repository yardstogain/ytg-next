import { Schedule } from '../types/football';

// All times -4 EDT
export const schedule: Schedule[] = [
  {
    week: 1,
    season: 2022,
    startDate: new Date('2022-09-08T20:20:00-04:00'),
    endDate: new Date('2022-09-12T23:59:00-04:00'),
    matchups: [
      {
        home: 'los-angeles-rams',
        away: 'buffalo-bills',
        time: new Date('2022-09-08T20:20:00-04:00'),
      },
      {
        home: 'atlanta-falcons',
        away: 'new-orleans-saints',
        time: new Date('2022-09-11T13:00:00-04:00'),
      },
      {
        home: 'carolina-panthers',
        away: 'cleveland-browns',
        time: new Date('2022-09-11T13:00:00-04:00'),
      },
      {
        home: 'chicago-bears',
        away: 'san-francisco-49ers',
        time: new Date('2022-09-11T13:00:00-04:00'),
      },
      {
        home: 'cincinnati-bengals',
        away: 'pittsburgh-steelers',
        time: new Date('2022-09-11T13:00:00-04:00'),
      },
      {
        home: 'detroit-lions',
        away: 'philadelphia-eagles',
        time: new Date('2022-09-11T13:00:00-04:00'),
      },
      {
        home: 'houston-texans',
        away: 'indianapolis-colts',
        time: new Date('2022-09-11T13:00:00-04:00'),
      },
      {
        home: 'miami-dolphins',
        away: 'new-england-patriots',
        time: new Date('2022-09-11T13:00:00-04:00'),
      },
      {
        home: 'new-york-jets',
        away: 'baltimore-ravens',
        time: new Date('2022-09-11T13:00:00-04:00'),
      },
      {
        home: 'washington-commanders',
        away: 'jacksonville-jaguars',
        time: new Date('2022-09-11T13:00:00-04:00'),
      },
      {
        home: 'tennessee-titans',
        away: 'new-york-giants',
        time: new Date('2022-09-11T16:25:00-04:00'),
      },
      {
        home: 'arizona-cardinals',
        away: 'kansas-city-chiefs',
        time: new Date('2022-09-11T16:25:00-04:00'),
      },
      {
        home: 'los-angeles-chargers',
        away: 'las-vegas-raiders',
        time: new Date('2022-09-11T16:25:00-04:00'),
      },
      {
        home: 'minnesota-vikings',
        away: 'green-bay-packers',
        time: new Date('2022-09-11T16:25:00-04:00'),
      },
      {
        home: 'dallas-cowboys',
        away: 'tampa-bay-buccaneers',
        time: new Date('2022-09-11T20:20:00-04:00'),
      },
      {
        home: 'seattle-seahawks',
        away: 'denver-broncos',
        time: new Date('2022-09-12T20:15:00-04:00'),
      },
    ],
  },
  {
    week: 2,
    season: 2022,
    startDate: new Date('2022-09-15T20:15:00-04:00'),
    endDate: new Date('2022-09-19T23:59:00-04:00'),
    matchups: [],
  },
  {
    week: 3,
    season: 2022,
    startDate: new Date('2022-09-22T20:15:00-04:00'),
    endDate: new Date('2022-09-26T23:59:00-04:00'),
    matchups: [],
  },
  {
    week: 4,
    season: 2022,
    startDate: new Date('2022-09-29T20:15:00-04:00'),
    endDate: new Date('2022-10-03T23:59:00-04:00'),
    matchups: [],
  },
  {
    week: 5,
    season: 2022,
    startDate: new Date('2022-10-06T20:15:00-04:00'),
    endDate: new Date('2022-10-10T23:59:00-04:00'),
    matchups: [],
  },
];
