import {
  Anchor,
  Avatar,
  Card,
  Container,
  Group,
  Stack,
  Text,
} from '@mantine/core';
import {
  supabaseServerClient,
  withPageAuth,
} from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { Comment, Content } from 'types/content';
import { Profile } from 'types/user';

type EnhancedComment = Comment & {
  profile: Pick<Profile, 'nickname' | 'teamName' | 'slug'>;
};

type EnhancedContent = Content & {
  profile: Pick<Profile, 'nickname' | 'teamName' | 'slug'>;
  comments: EnhancedComment[];
};

export const getServerSideProps = withPageAuth({
  redirectTo: '/login',
  async getServerSideProps(ctx) {
    const { data } = await supabaseServerClient(ctx)
      .from<EnhancedContent>('content')
      .select(
        `
        *, 
        profile(nickname, teamName, slug), 
        comments(*, profile(nickname, teamName, slug))
        `,
      )
      .match({ id: ctx.query.id });

    return { props: { content: data?.[0] } };
  },
});

type SinglePostProps = {
  content: EnhancedContent;
};

type ContentAuthorProps = {
  profile: EnhancedContent['profile'];
};

function ContentAuthor({ profile }: ContentAuthorProps) {
  return (
    <Group>
      <Avatar radius="xl">{profile.nickname}</Avatar>
      <Stack>
        <Link href={`/profile/${profile.slug}`} passHref>
          <Anchor component="a">{profile.nickname}</Anchor>
        </Link>
        <Text>{profile.teamName}</Text>
      </Stack>
    </Group>
  );
}

function SingleComment({
  id,
  markdownContent,
  createdAt,
  profile,
}: Pick<EnhancedComment, 'id' | 'markdownContent' | 'createdAt' | 'profile'>) {
  return (
    <Stack>
      <ContentAuthor profile={profile} />
      <Text>{markdownContent}</Text>
    </Stack>
  );
}

export default function SinglePost({ content }: SinglePostProps) {
  return (
    <Container size="lg">
      {/* <code>{JSON.stringify(content)}</code> */}
      <ContentAuthor profile={content.profile} />
      <Text>{content.markdownContent}</Text>
      <Group>
        <Stack>
          <Text>Called out</Text>
          {content.playerTags.map((player) => (
            <Text>{player}</Text>
          ))}
        </Stack>
        <Stack>
          <Text>Tags</Text>
          {content.tags.map((tag) => (
            <Text>{tag}</Text>
          ))}
        </Stack>
      </Group>
      {content.comments.length > 0 && (
        <Card withBorder shadow="md">
          {content.comments.map((comment) => (
            <SingleComment
              id={comment.id}
              markdownContent={comment.markdownContent}
              createdAt={comment.createdAt}
              profile={comment.profile}
            />
          ))}
        </Card>
      )}
    </Container>
  );
}
