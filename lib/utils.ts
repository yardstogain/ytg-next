import { User } from '@supabase/supabase-js';
import { stats2021 } from 'data/stats2021';
import { Schedule, SimpleTeamData, TeamSlug } from 'types/football';
import { Profile } from 'types/user';
import { roles } from './constants';
import { supabase } from './initSupabase';

export function isLoggedIn(user: User | null) {
  return user != null && user.role === 'authenticated';
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (!error) {
    if (window.location.pathname !== '/') {
      window.location.href = '/';
    }
  }
}

export function csvToTeamsData(csv: string): SimpleTeamData[] {
  // TODO: better line split
  const rows = csv.split(/\r\n|\n|\r/);
  return rows
    .map((row: string) => {
      const [name, ...stats] = row.split(',');
      const numericalStats = stats.map((stat) => parseFloat(stat));

      const [
        wins,
        losses,
        ties,
        winPercent, //pointsFor //pointsAgainst
        ,
        ,
        pointDiff,
        marginOfVictory,
        strengthOfSchedule, //frSrS //frOSrS //frDSrS
        ,
        ,
        ,
      ] = numericalStats;

      const fraudValue = getfraudValue({
        winPercent,
        pointDiff,
        marginOfVictory,
        strengthOfSchedule,
      });
      return { name, wins, losses, ties, fraudValue, icon: 'cats' };
    })
    .sort((a, b) => b.fraudValue - a.fraudValue)
    .map((team) => ({
      id: team.name.toLowerCase().split(' ').join('-'),
      ...team,
    }));
}

export type fraudValueInput = {
  winPercent: number;
  pointDiff: number;
  marginOfVictory: number;
  strengthOfSchedule: number;
};

export function getfraudValue({
  winPercent,
  pointDiff,
  marginOfVictory,
  strengthOfSchedule,
}: fraudValueInput): number {
  return (
    (winPercent * 0.75 +
      pointDiff * 1.1 +
      marginOfVictory * 0.35 +
      strengthOfSchedule * 0.75) /
    10
  );
}

export type TeamRecordInput = {
  wins: number;
  losses: number;
  ties: number;
};

export function getTeamRecord({ wins, losses, ties }: TeamRecordInput): string {
  return ties > 0 ? `${wins}-${losses}-${ties}` : `${wins}-${losses}`;
}

export function arraysHaveSameItems(array1: string[], array2: string[]) {
  if (array1.length === array2.length) {
    return array1.every((element) => {
      if (array2.includes(element)) {
        return true;
      }

      return false;
    });
  }

  return false;
}

export function getUserAvatar(userId: string): string {
  const avatarBucket =
    'https://frvypfdkmdsottjcsvay.supabase.co/storage/v1/object/public/avatars';
  return `${avatarBucket}/${userId}.jpeg`;
}

export function getTeamIcon(teamSlug: string): string {
  const avatarBucket =
    'https://frvypfdkmdsottjcsvay.supabase.co/storage/v1/object/public/team-assets';
  return `${avatarBucket}/${teamSlug}.png`;
}

// TODO: is this air-tight?
export function getCurrentWeek(schedule: Schedule[]): Schedule {
  const now = new Date();
  // Hard check for before season- return first week
  const first = schedule[0];
  const last = schedule[schedule.length - 1];

  if (now <= first.startDate) {
    return first;
  }
  // Hard check for after season- return last week
  if (now > last.endDate) {
    return last;
  }

  // Iterate
  let selectedWeek = last;
  for (let i = 0; i < schedule.length - 1; i += 1) {
    const week = schedule[i];
    const next = schedule[i + 1];
    // 1. If actively in the games (ie Thurs-Mon), it's that week
    if (week.startDate <= now && now < week.endDate) {
      selectedWeek = week;
    }
    // 2. If after end date but before next start date
    //    (ie Tues-Thurs), is next week
    if (week.endDate < now && now <= next.startDate) {
      selectedWeek = next;
    }
  }
  return selectedWeek;
}

export const validateNickname = (nickname: string): boolean => {
  const nickRegex = /^[a-z0-9]+(?:[_-][a-z0-9]+)*$/;
  return nickRegex.test(nickname);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^\S+@\S+\.\S+$/;
  return emailRegex.test(email);
};

export const getDisplayName = (
  profile: Partial<Profile>,
  fallback: string,
): string => {
  if (profile.nickname) {
    return profile.nickname;
  } else if (profile.name) {
    return profile.name;
  } else {
    return fallback;
  }
};

export const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export const getFraudValueColor = (fraudValue: number): string => {
  if (fraudValue > 15) return 'teal';
  if (fraudValue > 7.5) return 'lime';
  if (fraudValue < 0) return 'red';
  return 'yellow';
};

export const isAdmin = (role: number) => {
  return role >= roles.admin;
};

export const teamData = csvToTeamsData(stats2021);

export const teamLookup: Record<string, SimpleTeamData> = teamData.reduce(
  (acc, curr) => {
    return { [curr.id]: { ...curr }, ...acc };
  },
  {},
);

export const calculateFraudListWinnings = (
  picks: TeamSlug[],
  losers: TeamSlug[],
): number => {
  return picks.reduce((acc, curr) => {
    if (losers.includes(curr)) {
      return acc + teamLookup[curr].fraudValue;
    }
    return acc;
  }, 0);
};
