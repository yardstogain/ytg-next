import {
  Container,
  Text,
  List,
  Card,
  Group,
  Stack,
  Title,
  Button,
  Anchor,
} from '@mantine/core';
import { PageHeader, TeamSelection } from 'components';
import { csvToTeamsData, getCurrentWeek } from 'lib/utils';
import { stats2021 } from 'data/stats2021';
import { schedule } from 'data/schedule2022';
import {
  getUser,
  supabaseServerClient,
  User,
  withPageAuth,
} from '@supabase/auth-helpers-nextjs';
import {
  Clock,
  ListCheck,
  Timeline,
  User as UserIcon,
} from 'tabler-icons-react';
import RelativeTime from '@yaireo/relative-time';
import { NextLink } from '@mantine/next';
import { useRouter } from 'next/router';

export const getServerSideProps = withPageAuth({
  redirectTo: '/login',
  async getServerSideProps(ctx) {
    const { user } = await getUser(ctx);
    const weekData = getCurrentWeek(schedule);

    const { data } = await supabaseServerClient(ctx)
      .from('fraudPicks')
      .select('*, profile(teamName)')
      .match({ week: weekData.week, season: 2022, userId: user.id })
      .limit(1);

    return { props: { activeFraudPicks: data[0] } };
  },
});

type FraudListProps = {
  user: User;
};

export default function FraudListPicks({
  user,
  activeFraudPicks,
}: FraudListProps) {
  const router = useRouter();

  const relativeTime = new RelativeTime();

  const season = 2022;
  const week = 1;

  const weekData = getCurrentWeek(schedule);
  console.log('testing week: ', weekData.week);
  console.log('afp', activeFraudPicks);
  return (
    <Container size="lg">
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
          <Title order={2}>{activeFraudPicks.profile.teamName}</Title>
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
