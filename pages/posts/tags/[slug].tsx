import {
  Card,
  Container,
  Grid,
  Text,
  Title,
  Stack,
  Button,
} from '@mantine/core';
import {
  supabaseServerClient,
  withPageAuth,
} from '@supabase/auth-helpers-nextjs';
import { PageHeader, PostCard } from 'components';
import { renderPageTitle } from 'lib/utils';
import { FullContent, Tag } from 'types/content';
import { FilePlus, Tag as TagIcon } from 'tabler-icons-react';
import { NextLink } from '@mantine/next';

export const getServerSideProps = withPageAuth({
  redirectTo: '/login',
  async getServerSideProps(ctx) {
    //   const { data: content } = await supabaseServerClient(ctx)
    //     .from<EnhancedContent>('content')
    //     .select(
    //       `
    //       *,
    //       profile(id, nickname, teamName, slug),
    //       comments(*, profile(id, nickname, teamName, slug))
    //       `,
    //     )
    //     .match({ id: ctx.query.id })
    //     .single();

    const { data: tag } = await supabaseServerClient(ctx)
      .from<Tag>('tags')
      .select('*')
      .match({ slug: ctx.query.slug })
      .single();

    if (!tag) {
      return {
        notFound: true,
      };
    }

    const { data: allTags } = await supabaseServerClient(ctx)
      .from<Tag>('tags')
      .select('*');

    const { data: content } = await supabaseServerClient(ctx)
      .from<FullContent>('content')
      .select('*, comments(id), profile(*)')
      .contains('tags', [tag.slug])
      .order('createdAt', { ascending: false });

    return { props: { tag, allTags, content } };
  },
});

type TagListPageProps = {
  tag: Tag;
  allTags: Tag[];
  content: FullContent[];
};

export default function TagListPage({
  tag,
  allTags,
  content,
}: TagListPageProps) {
  return (
    <Container size="lg">
      {renderPageTitle(`Posts in ${tag.title}`)}
      <PageHeader
        title={tag.title}
        description={tag.description}
        icon={<TagIcon size={48} />}
        iconColor="green"
      />
      <Grid mt="xl">
        <Grid.Col span={8}>
          <Title order={3} mb="sm">
            {content.length} {content.length === 1 ? 'Post' : 'Posts'}
          </Title>
          {content.length > 0 ? (
            content.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <Text>Nothing here yet </Text>
          )}
        </Grid.Col>
        <Grid.Col span={4}>
          <Stack spacing={0} mb="sm">
            <Title order={3}>All Tags</Title>
            <Text color="dimmed" size="md">
              Do your own research
            </Text>
          </Stack>
          <Stack>
            {allTags.map((item) => (
              <Card
                key={item.slug}
                p="sm"
                component={NextLink}
                withBorder
                href={`/posts/tags/${item.slug}`}
                sx={(theme) => ({
                  background: 'transparent',
                  cursor: 'pointer',
                  borderColor:
                    tag.slug === item.slug
                      ? theme.colors.blue[7]
                      : theme.colors.gray[8],
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
