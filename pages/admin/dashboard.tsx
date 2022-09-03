import { Container, SimpleGrid, Title } from '@mantine/core';
import {
  getUser,
  supabaseServerClient,
  withPageAuth,
} from '@supabase/auth-helpers-nextjs';
import { Profile } from 'types/user';
import { AdminStat, AdminTabs } from 'components';
import { File, MessageCircle, User } from 'tabler-icons-react';
import { Comment, Content } from 'types/content';
import { isAdmin } from 'lib/utils';

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

    const { count: numProfiles } = await supabaseServerClient(ctx)
      .from<Profile>('profile')
      .select('id', { count: 'exact', head: true });

    const { count: numPosts } = await supabaseServerClient(ctx)
      .from<Content>('content')
      .select('id', { count: 'exact', head: true });

    const { count: numComments } = await supabaseServerClient(ctx)
      .from<Comment>('comments')
      .select('id', { count: 'exact', head: true });

    return {
      props: {
        numProfiles,
        numPosts,
        numComments,
      },
    };
  },
});

type AdminHomeProps = {
  numProfiles: number;
  numPosts: number;
  numComments: number;
};

export default function AdminHome({
  numProfiles,
  numPosts,
  numComments,
}: AdminHomeProps) {
  console.log('p', numPosts);
  return (
    <Container size="lg">
      <AdminTabs />
      <Title order={4} mt="xl">
        User Stats
      </Title>
      <SimpleGrid cols={4} mt="sm">
        <AdminStat
          title="Total Users"
          description="Users with profile data"
          icon={<User size={22} />}
          accent="pink"
          stat={numProfiles}
        />
      </SimpleGrid>
      <Title order={4} mt="xl">
        Content Stats
      </Title>

      <SimpleGrid cols={4} mt="sm">
        <AdminStat
          title="Total Posts"
          description="All posts made, all time"
          icon={<File size={22} />}
          accent="orange"
          stat={numPosts}
        />
        <AdminStat
          title="Total Comments"
          description="All comments made, all time"
          icon={<MessageCircle size={22} />}
          accent="cyan"
          stat={numComments}
        />
        <AdminStat
          title="Comments per post"
          description="Average amount of comments per post"
          icon={<MessageCircle size={22} />}
          accent="blue"
          stat={(numComments / numPosts).toFixed(1)}
        />
        <AdminStat
          title="Comments per user"
          description="Average amount of comments per user"
          icon={<MessageCircle size={22} />}
          accent="violet"
          stat={(numComments / numProfiles).toFixed(1)}
        />
      </SimpleGrid>
    </Container>
  );
}
