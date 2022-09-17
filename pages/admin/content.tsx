import { Container, Text } from '@mantine/core';
import {
  getUser,
  supabaseServerClient,
  withPageAuth,
} from '@supabase/auth-helpers-nextjs';
import { AdminTabs } from 'components';
import { renderPageTitle, isAdmin } from 'lib/utils';
import { FullContent } from 'types/content';
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

    const { data: allPosts } = await supabaseServerClient(ctx)
      .from<FullContent>('content')
      .select('*, profile(*), comments(*)');

    return {
      props: { allPosts },
    };
  },
});

type AdminContentProps = {
  allPosts: FullContent[];
};

export default function AdminUsers({ allPosts }: AdminContentProps) {
  return (
    <Container size="lg">
      {renderPageTitle('Content Management - Admin')}
      <AdminTabs />
      {allPosts.map((post) => (
        <>
          <Text>{post.profile.nickname}</Text>
        </>
      ))}
    </Container>
  );
}
