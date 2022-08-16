import { Container, Text } from '@mantine/core';
import {
  getUser,
  supabaseServerClient,
  User,
  withPageAuth,
} from '@supabase/auth-helpers-nextjs';
import { Profile } from 'types/user';

export const getServerSideProps = withPageAuth({
  redirectTo: '/login',
  async getServerSideProps(ctx) {
    const { user } = await getUser(ctx);
    // Run queries with RLS on the server
    const { data } = await supabaseServerClient(ctx)
      .from<Profile>('profile')
      .select('*')
      .match({ [user.length === 36 ? 'id' : 'nickname']: user })
      .limit(1);

    return { props: { profile: data?.[0] } };
  },
});

type ProfileProps = {
  user: User;
  profile: Profile;
};

export default function UserProfile({ user, profile }: ProfileProps) {
  console.log(profile);
  return (
    <Container>
      <Text>Hello {user?.email}</Text>
      <Text>your name is: {profile?.name}</Text>
      <Text>your team is: {profile?.teamName}</Text>
    </Container>
  );
}
