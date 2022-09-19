import {
  ActionIcon,
  Anchor,
  Box,
  Button,
  Container,
  Group,
  Modal,
  Paper,
  Table,
} from '@mantine/core';
import { NextLink } from '@mantine/next';
import {
  getUser,
  supabaseClient,
  supabaseServerClient,
  withPageAuth,
} from '@supabase/auth-helpers-nextjs';
import { AdminTabs, MarkdownContent } from 'components';
import { renderPageTitle, isAdmin, relativeTime } from 'lib/utils';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Eye, Trash } from 'tabler-icons-react';
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
      .select('*, profile(*), comments(*)')
      .order('createdAt', { ascending: false });

    return {
      props: { allPosts },
    };
  },
});

type AdminContentProps = {
  allPosts: FullContent[];
};

export default function AdminContent({ allPosts }: AdminContentProps) {
  const router = useRouter();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const onClose = () => {
    setDeleteModalOpen(false);
    setSelectedPost('');
  };

  const handleDelete = async () => {
    setLoading(true);

    const { error: commentDeleteError } = await supabaseClient
      .from('comments')
      .delete()
      .match({ contentId: selectedPost });

    const { error: notificationDeleteError } = await supabaseClient
      .from('notifications')
      .delete()
      .match({ contentId: selectedPost });

    const { error: contentDeleteError } = await supabaseClient
      .from('content')
      .delete()
      .match({ id: selectedPost });

    if (commentDeleteError) {
      console.log(
        `Error deleting comments for post ${selectedPost}`,
        commentDeleteError,
      );
    }
    if (notificationDeleteError) {
      console.log(
        `Error deleting notifications for post ${selectedPost}`,
        notificationDeleteError,
      );
    }
    if (contentDeleteError) {
      console.log(
        `Error deleting content ID ${selectedPost}`,
        contentDeleteError,
      );
    }

    router.replace(router.asPath);

    setLoading(false);
    onClose();
  };

  return (
    <Container size="lg">
      {renderPageTitle('Content Management - Admin')}
      <Modal
        centered
        size="sm"
        title="Confirm Delete"
        opened={deleteModalOpen}
        onClose={onClose}
      >
        <Group position="center" mt="xl">
          <Button color="red" onClick={handleDelete} loading={loading}>
            Delete
          </Button>
          <Button variant="subtle" color="gray" onClick={onClose}>
            Cancel
          </Button>
        </Group>
      </Modal>
      <AdminTabs />
      <Table verticalSpacing="xs" mt="xl">
        <thead>
          <tr>
            <th>Content</th>
            <th>Author</th>
            <th>Comments</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {allPosts.map((post) => (
            <Box component="tr" key={post.id} sx={{ verticalAlign: 'top' }}>
              <td>
                <Paper sx={{ maxHeight: 120, overflow: 'hidden' }}>
                  <MarkdownContent content={post.markdownContent} />
                </Paper>
              </td>
              <td>
                <Anchor
                  component={NextLink}
                  href={`/player/${post.profile.slug}`}
                >
                  {post.profile.nickname}
                </Anchor>
              </td>
              <td>{post.comments.length}</td>
              <td>{relativeTime.from(new Date(post.createdAt))}</td>
              <td>
                <Group spacing="xs">
                  <ActionIcon
                    variant="default"
                    component={NextLink}
                    href={`/posts/${post.id}`}
                  >
                    <Eye size={16} />
                  </ActionIcon>
                  <ActionIcon
                    variant="default"
                    onClick={() => {
                      setDeleteModalOpen(true);
                      setSelectedPost(post.id);
                    }}
                  >
                    <Trash size={16} />
                  </ActionIcon>
                </Group>
              </td>
            </Box>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
