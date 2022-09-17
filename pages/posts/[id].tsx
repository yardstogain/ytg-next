import {
  Anchor,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Grid,
  Group,
  Stack,
  Text,
  Textarea,
  Title,
} from '@mantine/core';
import { useInputState } from '@mantine/hooks';
import { NextLink } from '@mantine/next';
import {
  getUser,
  supabaseClient,
  supabaseServerClient,
  User,
} from '@supabase/auth-helpers-nextjs';
import { MarkdownContent } from 'components';
import { getUserAvatar, relativeTime, renderPageTitle } from 'lib/utils';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  Calendar,
  Clock,
  FilePlus,
  MessageCircle,
  Pencil,
  Speakerphone,
  Tags,
  User as UserIcon,
} from 'tabler-icons-react';
import { Comment, Content, Tag } from 'types/content';
import { Profile } from 'types/user';

type EnhancedComment = Comment & {
  profile: Pick<Profile, 'nickname' | 'teamName' | 'slug' | 'id'>;
};

type EnhancedContent = Content & {
  profile: Pick<Profile, 'nickname' | 'teamName' | 'slug' | 'id'>;
  comments: EnhancedComment[];
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { user } = await getUser(ctx);
  const { data: content } = await supabaseServerClient(ctx)
    .from<EnhancedContent>('content')
    .select(
      `
        *, 
        profile(id, nickname, teamName, slug), 
        comments(*, profile(id, nickname, teamName, slug))
        `,
    )
    .match({ id: ctx.query.id })
    .single();

  if (!content) {
    return {
      notFound: true,
    };
  }

  const { data: taggedUsers } = await supabaseServerClient(ctx)
    .from<Profile>('profile')
    .select('nickname, slug')
    .in('id', [...content.playerTags]);

  const { data: tags } = await supabaseServerClient(ctx)
    .from<Tag>('tags')
    .select('*')
    .in('slug', [...content.tags]);

  return { props: { content, taggedUsers, tags, user } };
};

type ContentAuthorProps = {
  profile: EnhancedContent['profile'];
  isOp?: boolean;
};

function ContentAuthor({ profile, isOp }: ContentAuthorProps) {
  return (
    <Group spacing={0}>
      <Avatar radius="xl" color="pink" src={getUserAvatar(profile.id)}>
        <UserIcon />
      </Avatar>
      <Stack spacing={0} ml="xs">
        <Group spacing={0}>
          <Link href={`/player/${profile.slug}`} passHref>
            <Anchor component="a" weight="bold">
              <Text color="white">{profile.nickname}</Text>
            </Anchor>
          </Link>
          {isOp && (
            <Badge size="sm" ml="xs">
              OP
            </Badge>
          )}
        </Group>

        <Text color="dimmed" size="sm">
          {profile.teamName}
        </Text>
      </Stack>
    </Group>
  );
}

type SingleCommentProps = Pick<
  EnhancedComment,
  'id' | 'markdownContent' | 'createdAt' | 'profile'
> & {
  isOp?: boolean;
};

function SingleComment({
  id,
  markdownContent,
  createdAt,
  profile,
  isOp,
}: SingleCommentProps) {
  return (
    <Stack
      id={`comment-${id}`}
      p="md"
      spacing={0}
      sx={(theme) => ({
        borderBottom: `1px solid ${theme.colors.gray[8]}`,
      })}
    >
      <ContentAuthor profile={profile} isOp={isOp} />
      <MarkdownContent content={markdownContent} />
      <Group spacing={8} mt="sm">
        <Text color="dimmed" sx={{ lineHeight: 1 }}>
          <Calendar size={14} />
        </Text>
        <Text size="sm" color="dimmed">
          {relativeTime.from(new Date(createdAt))}
        </Text>
      </Group>
    </Stack>
  );
}

type SinglePostProps = {
  content: EnhancedContent;
  taggedUsers: Profile[];
  tags: Tag[];
  user: User;
};

export default function SinglePost({
  content,
  taggedUsers,
  tags,
  user,
}: SinglePostProps) {
  console.log(user.id, content.author);
  const router = useRouter();
  const [commentContent, setCommentContent] = useInputState('');
  const [loading, setLoading] = useState(false);

  const handleCommentSubmit = async () => {
    setLoading(true);

    const { error } = await supabaseClient.from<Comment>('comments').insert({
      author: user.id,
      contentId: content.id,
      markdownContent: commentContent,
    });

    if (!error) {
      router.replace(router.asPath);
    }
    setCommentContent('');
    setLoading(false);
  };

  const sortedComments = content.comments.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  return (
    <Container size="lg">
      {renderPageTitle(`Post by ${content.profile.nickname}`)}
      <Group position="apart" my="xl">
        <Link href="/posts" passHref>
          <Button
            component="a"
            variant="subtle"
            color="gray"
            leftIcon={<ArrowLeft />}
          >
            All Posts
          </Button>
        </Link>
      </Group>
      <Grid gutter="xl">
        <Grid.Col span={8}>
          <Group spacing={0} position="apart">
            <ContentAuthor profile={content.profile} />
            {user.id === content.author && (
              <Button
                component={NextLink}
                href={`/posts/edit/${content.id}`}
                variant="subtle"
                color="gray"
                leftIcon={<Pencil size={16} />}
              >
                Edit
              </Button>
            )}
          </Group>
          <MarkdownContent content={content.markdownContent} />
          <Group spacing="md" mt="sm">
            <Group spacing={8}>
              <Text color="dimmed" sx={{ lineHeight: 1 }}>
                <Calendar size={14} />
              </Text>
              <Text size="sm" color="dimmed">
                {relativeTime.from(new Date(content.createdAt))}
              </Text>
            </Group>
            {content.updatedAt !== content.createdAt && (
              <Group spacing={8}>
                <Text color="dimmed" sx={{ lineHeight: 1 }}>
                  <Clock size={14} />
                </Text>
                <Text size="sm" color="dimmed">
                  Edited {relativeTime.from(new Date(content.updatedAt))}
                </Text>
              </Group>
            )}
          </Group>

          <>
            <Group position="apart" align="center">
              <Title order={3} mt="xl" mb="md">
                {sortedComments.length}{' '}
                {sortedComments.length === 1 ? 'Reply' : 'Replies'}
              </Title>
              {sortedComments.length > 0 && (
                <Button
                  component="a"
                  href="#comment-form"
                  variant="subtle"
                  leftIcon={<ArrowDown size={16} />}
                >
                  Jump to reply form
                </Button>
              )}
            </Group>

            <Card withBorder p={0} sx={{ background: 'transparent' }}>
              {sortedComments.map((comment) => (
                <SingleComment
                  key={comment.id}
                  id={comment.id}
                  markdownContent={comment.markdownContent}
                  createdAt={comment.createdAt}
                  profile={comment.profile}
                  isOp={comment.author === content.author}
                />
              ))}
              <Box p="md" id="comment-form">
                {user ? (
                  <>
                    <Title order={4} mb="xs">
                      <Text component="span" color="dimmed" mr={8}>
                        <MessageCircle size={16} />
                      </Text>
                      Jump in
                    </Title>
                    <Textarea
                      size="md"
                      label="Reply"
                      description="Don't be too nice, and make sure everything is in writing"
                      minRows={4}
                      value={commentContent}
                      onChange={setCommentContent}
                    />
                    <Button
                      mt="sm"
                      loading={loading}
                      onClick={handleCommentSubmit}
                    >
                      Submit
                    </Button>
                  </>
                ) : (
                  <Button component={NextLink} href="/login" variant="subtle">
                    Login to Reply
                  </Button>
                )}
              </Box>
            </Card>
          </>
        </Grid.Col>
        <Grid.Col span={4}>
          <Card withBorder shadow="lg" mb="lg">
            <Title order={4} mb="xs">
              <Text component="span" color="dimmed" mr={8}>
                <Speakerphone size={16} />
              </Text>
              Called out
            </Title>
            {taggedUsers.length > 0 ? (
              taggedUsers.map((player) => (
                <Link
                  key={player.slug}
                  href={`/player/${player.slug}`}
                  passHref
                >
                  <Badge
                    variant="outline"
                    component="a"
                    size="lg"
                    color="indigo"
                    mr="xs"
                    sx={(theme) => ({
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: theme.colors.gray[3],
                      },
                    })}
                  >
                    {player.nickname}
                  </Badge>
                </Link>
              ))
            ) : (
              <Badge color="gray" variant="filled">
                No one
              </Badge>
            )}
            <Title order={4} mb="xs" mt="lg">
              <Text component="span" color="dimmed" mr={8}>
                <Tags size={16} />
              </Text>
              Tags
            </Title>
            {tags.map((tag) => (
              <Link key={tag.slug} href={`/posts/tags/${tag.slug}`} passHref>
                <Badge
                  variant="dot"
                  component="a"
                  size="lg"
                  color="green"
                  mr="xs"
                  sx={(theme) => ({
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: theme.colors.green[8],
                    },
                  })}
                >
                  {tag.title}
                </Badge>
              </Link>
            ))}
          </Card>
          <Card withBorder shadow="lg">
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
