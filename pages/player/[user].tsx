import { Container, Text } from '@mantine/core';
import {
  supabaseServerClient,
  withPageAuth,
} from '@supabase/auth-helpers-nextjs';

export const getServerSideProps = withPageAuth({
  redirectTo: '/login',
  async getServerSideProps(ctx) {
    const { user } = ctx.query;
    // Run queries with RLS on the server
    const { data } = await supabaseServerClient(ctx)
      .from('profile')
      .select('*')
      .match({ nickname: user })
      .limit(1);

    return { props: { profile: data[0] } };
  },
});

export default function Profile({ user, profile }) {
  console.log(profile);
  return (
    <Container>
      <Text>Hello {user?.email}</Text>
      <Text>your name is: {profile?.name}</Text>
      <Text>your team is: {profile?.team_name}</Text>
    </Container>
  );
}
