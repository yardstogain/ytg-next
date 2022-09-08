import {
  Card,
  Container,
  Grid,
  Text,
  Title,
  Stack,
  Button,
} from '@mantine/core';
import { supabaseServerClient } from '@supabase/auth-helpers-nextjs';
import { PageHeader, PostCard } from 'components';
import { renderPageTitle } from 'lib/utils';
import { FullContent, Tag } from 'types/content';
import { FilePlus, Files } from 'tabler-icons-react';
import { NextLink } from '@mantine/next';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { data: tags } = await supabaseServerClient(ctx)
    .from<Tag>('tags')
    .select('*');

  const { data: content } = await supabaseServerClient(ctx)
    .from<FullContent>('content')
    .select('*, comments(id), profile(*)')
    .order('createdAt', { ascending: false })
    .limit(10);

  return { props: { tags, content } };
};

type PostsIndexPageProps = {
  tags: Tag[];
  content: FullContent[];
};

export default function PostsIndexPage({ tags, content }: PostsIndexPageProps) {
  return (
    <Container size="lg">
      {renderPageTitle('All Posts')}
      <PageHeader
        title="Recent Posts"
        description="Take in all the wisdom your peers have to offer, keep up with the news, and celebrate your victories"
        icon={<Files size={48} />}
        iconColor="green"
      />
      <Grid mt="xl">
        <Grid.Col span={8}>
          {content.length > 0 ? (
            content.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <Text>Nothing here yet </Text>
          )}
        </Grid.Col>
        <Grid.Col span={4}>
          <Stack spacing={0} mb="sm">
            <Title order={3}>Tags</Title>
            <Text color="dimmed" size="md">
              Incoherent ramblings but organized
            </Text>
          </Stack>
          <Stack>
            {tags.map((item) => (
              <Card
                key={item.slug}
                p="sm"
                component={NextLink}
                withBorder
                href={`/posts/tags/${item.slug}`}
                sx={(theme) => ({
                  background: 'transparent',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: theme.colors.blue[3],
                  },
                })}
              >
                <Text weight="bold">{item.title}</Text>
                <Text color="dimmed" size="sm">
                  {item.description}
                </Text>
              </Card>
            ))}
          </Stack>
          <Card withBorder shadow="lg" mt="md">
            <Button
              component={NextLink}
              href="/posts/new"
              variant="gradient"
              gradient={{ from: 'pink', to: 'orange' }}
              leftIcon={<FilePlus size={16} />}
              fullWidth
            >
              New Post
            </Button>
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
