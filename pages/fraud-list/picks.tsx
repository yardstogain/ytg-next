import {
  Container,
  Text,
  List,
  Card,
  Group,
  Stack,
  Title,
} from '@mantine/core';
import { PageHeader, TeamSelection } from 'components';
import { csvToTeamsData } from 'lib/utils';
import { fraudData } from 'data/fraudData';
import {
  supabaseServerClient,
  User,
  withPageAuth,
} from '@supabase/auth-helpers-nextjs';
import { ListCheck } from 'tabler-icons-react';

export const getServerSideProps = withPageAuth({
  redirectTo: '/login',
  async getServerSideProps(ctx) {
    // Run queries with RLS on the server
    const { data } = await supabaseServerClient(ctx)
      .from('fraud-picks')
      .select('*')
      //   .eq('week', 7)
      //   .eq('season', 2021)
      .match({ week: 7, season: 2021 })
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
  return (
    <Container size="lg">
      <PageHeader
        title="Fraud List Week 7 Picks"
        description="Pick three teams that you think will lose this week. The more you
              wager, the more you can win, and you'll score a bonus for multiple
              correct guesses. Who's a fraud this week?"
        icon={<ListCheck size={48} />}
        iconColor="teal.9"
      />

      <TeamSelection
        teams={csvToTeamsData(fraudData)}
        activeFraudPicks={activeFraudPicks}
      />
    </Container>
  );
}
