import { Container } from '@mantine/core';
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

    const { data } = await supabaseServerClient(ctx)
      .from('profile')
      .select('*')
      .match({ id: user.id });

    return {
      props: {
        profile: data,
      },
    };
  },
});

type AdminHomeProps = {
  user: User;
  profile: Profile;
};

export default function AdminHome({ user, profile }: AdminHomeProps) {
  console.log('p', profile, user);
  return <Container size="lg">heyo</Container>;
}
