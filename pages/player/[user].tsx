import { Container, Text } from '@mantine/core';
import {
  getUser,
  supabaseServerClient,
  withPageAuth,
} from '@supabase/auth-helpers-nextjs';
import { currencyFormatter } from 'lib/utils';
import { FraudListWinnings } from 'types/football';
import { Profile } from 'types/user';

export const getServerSideProps = withPageAuth({
  redirectTo: '/login',
  async getServerSideProps(ctx) {
    const { user } = await getUser(ctx);

    const { data: profile } = await supabaseServerClient(ctx)
      .from<Profile>('profile')
      .select('*')
      .match({ slug: ctx.query.user })
      .single();

    if (!profile) {
      return {
        notFound: true,
      };
    }

    const { data: fraudListWinnings } = await supabaseServerClient(ctx)
      .from<FraudListWinnings>('fraudListWinnings')
      .select('*')
      // TODO: season
      .match({ season: 2022, userId: user.id });

    const seasonsFraudListWinnings = fraudListWinnings?.reduce((acc, curr) => {
      return acc + curr.winnings;
    }, 0);

    return { props: { profile, seasonsFraudListWinnings } };
  },
});

type ProfileProps = {
  profile: Profile;
  seasonsFraudListWinnings: number;
};

export default function UserProfile({
  profile,
  seasonsFraudListWinnings,
}: ProfileProps) {
  return (
    <Container>
      <Text>your name is: {profile?.name}</Text>
      <Text>your team is: {profile?.teamName}</Text>
      <Text>you made {currencyFormatter.format(seasonsFraudListWinnings)}</Text>
    </Container>
  );
}
