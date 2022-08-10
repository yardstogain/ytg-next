import { User } from '@supabase/supabase-js';
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

export type SimpleTeamData = {
  name: string;
  icon: string;
  wins: number;
  losses: number;
  ties: number;
  fraudValue: number;
};

export function csvToTeamsData(csv: string): SimpleTeamData[] {
  // TODO: better line split
  const rows = csv.split(/\r\n|\n|\r/);
  return rows
    .map((row: string) => {
      const [name, ...stats] = row.split(',');
      const numericalStats = stats.map((stat) => parseFloat(stat, 10));

      const [
        wins,
        losses,
        ties,
        winPercent,
        pointsFor,
        pointsAgainst,
        pointDiff,
        marginOfVictory,
        strengthOfSchedule,
        frSrS,
        frOSrS,
        frDSrS,
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
    winPercent * 1.0 +
    pointDiff * 0.6 +
    marginOfVictory * 0.6 +
    strengthOfSchedule * 0.5
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

export function arraysHaveSameItems(array1, array2) {
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
