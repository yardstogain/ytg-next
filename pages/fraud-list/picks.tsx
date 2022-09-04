import { Container, Group, Title, Button } from '@mantine/core';
import { PageHeader, TeamSelection } from 'components';
import { csvToTeamsData, getCurrentWeek, renderPageTitle } from 'lib/utils';
import { stats2021 } from 'data/stats2021';
import { schedule } from 'data/schedule2022';
import {
  getUser,
  supabaseServerClient,
  withPageAuth,
} from '@supabase/auth-helpers-nextjs';
import { ListCheck } from 'tabler-icons-react';
import { Profile } from 'types/user';
import { FraudPicks } from 'types/football';
import Link from 'next/link';

type FraudPicksWithPartialProfile = FraudPicks & {
  profile: {
    teamName: Profile['teamName'];
    slug: Profile['slug'];
  };
};

export const getServerSideProps = withPageAuth({
  redirectTo: '/login',
  async getServerSideProps(ctx) {
    const { user } = await getUser(ctx);
    const weekData = getCurrentWeek(schedule);

    const { data: activeFraudPicks } = await supabaseServerClient(ctx)
      .from<FraudPicksWithPartialProfile>('fraudPicks')
      .select('*')
      .match({ week: weekData.week, season: 2022, userId: user.id })
      .single();

    const { data: profile } = await supabaseServerClient(ctx)
      .from<Profile>('profile')
      .select('*')
      .match({ id: user.id })
      .single();

    return { props: { profile, activeFraudPicks: activeFraudPicks || [] } };
  },
});

type FraudListProps = {
  profile: Profile;
  activeFraudPicks: FraudPicksWithPartialProfile;
};

export default function FraudListPicks({
  profile,
  activeFraudPicks,
}: FraudListProps) {
  const weekData = getCurrentWeek(schedule);

  return (
    <Container size="lg">
      {renderPageTitle('Picks - Fraud List')}
      <PageHeader
        title={`Fraud List Week ${weekData.week} Picks`}
        description="Pick three teams that you think will lose this week. The more you
              wager, the more you can win, and you'll score a bonus for multiple
              correct guesses. Who's a fraud this week?"
        icon={<ListCheck size={48} />}
        iconColor="teal.9"
      />
      <Group spacing={0} position="apart" mt="xl">
        <Group spacing="xs">
          <Title order={2}>My Picks</Title>
        </Group>
        <Link href={`/player/${profile.slug}`} passHref>
          <Button component="a" leftIcon={<ListCheck />} variant="outline">
            Previous Picks on Profile
          </Button>
        </Link>
      </Group>
      <TeamSelection
        teams={csvToTeamsData(stats2021)}
        activeFraudPicks={activeFraudPicks}
        matchups={weekData}
      />
    </Container>
  );
}
