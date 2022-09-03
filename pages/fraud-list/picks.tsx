import { Container, Group, Title, Button } from '@mantine/core';
import { PageHeader, TeamSelection } from 'components';
import { csvToTeamsData, getCurrentWeek, renderPageTitle } from 'lib/utils';
import { stats2021 } from 'data/stats2021';
import { schedule } from 'data/schedule2022';
import {
  getUser,
  supabaseServerClient,
  // User,
  withPageAuth,
} from '@supabase/auth-helpers-nextjs';
import { ListCheck } from 'tabler-icons-react';
import { useRouter } from 'next/router';
import { Profile } from 'types/user';
import { FraudPicks } from 'types/football';

type FraudPicksWithPartialProfile = FraudPicks & {
  profile: {
    teamName: Profile['teamName'];
  };
};

export const getServerSideProps = withPageAuth({
  redirectTo: '/login',
  async getServerSideProps(ctx) {
    const { user } = await getUser(ctx);
    const weekData = getCurrentWeek(schedule);

    const { data } = await supabaseServerClient(ctx)
      .from<FraudPicksWithPartialProfile>('fraudPicks')
      .select('*, profile(teamName)')
      .match({ week: weekData.week, season: 2022, userId: user.id })
      .single();

    return { props: { activeFraudPicks: data || [] } };
  },
});

type FraudListProps = {
  // user: User;
  activeFraudPicks: FraudPicksWithPartialProfile;
};

export default function FraudListPicks({
  // user,
  activeFraudPicks,
}: FraudListProps) {
  const router = useRouter();

  const weekData = getCurrentWeek(schedule);
  console.log('testing week: ', weekData.week);
  console.log('afp', activeFraudPicks);
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
        <Button
          leftIcon={<ListCheck />}
          variant="outline"
          onClick={() => {
            router.push('/fraud-list/history');
          }}
        >
          Pick History
        </Button>
      </Group>
      <TeamSelection
        teams={csvToTeamsData(stats2021)}
        activeFraudPicks={activeFraudPicks}
        matchups={weekData}
      />
    </Container>
  );
}
