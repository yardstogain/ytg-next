import { Container, Text } from '@mantine/core';
import {
  getUser,
  supabaseServerClient,
  withPageAuth,
} from '@supabase/auth-helpers-nextjs';
import { AdminTabs, RoleBadge } from 'components';
import { isAdmin } from 'lib/utils';
import { Profile } from 'types/user';

export const getServerSideProps = withPageAuth({
  redirectTo: '/login',
  async getServerSideProps(ctx) {
    const { user } = await getUser(ctx);

    const { data: selfRole } = await supabaseServerClient(ctx)
      .from<Profile>('profile')
      .select('role')
      .match({ id: user.id })
      .single();

    if (selfRole && !isAdmin(selfRole.role)) {
      return {
        notFound: true,
      };
    }

    const { data: allUsers } = await supabaseServerClient(ctx)
      .from<Profile>('profile')
      .select('*');

    return {
      props: { allUsers },
    };
  },
});

type AdminUsersProps = {
  allUsers: Profile[];
};

export default function AdminUsers({ allUsers }: AdminUsersProps) {
  return (
    <Container size="lg">
      <AdminTabs />
      <Text>Manage the users here (ban, change role, view profile)</Text>
      {allUsers.map((user) => (
        <>
          <Text>{user.nickname}</Text>
          <RoleBadge role={user.role} />
        </>
      ))}
    </Container>
  );
}
