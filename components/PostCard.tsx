import { Avatar, Badge, Card, Group, Stack, Text } from '@mantine/core';
import { getUserAvatar, relativeTime } from 'lib/utils';
import { useRouter } from 'next/router';
import { Calendar, MessageCircle } from 'tabler-icons-react';
import { FullContent } from 'types/content';

type PostCardProps = {
  post: FullContent;
  calledOut?: boolean;
};
export function PostCard({ post, calledOut }: PostCardProps) {
  const router = useRouter();

  return (
    <Card
      withBorder
      shadow="lg"
      mb="md"
      onClick={() => {
        router.push(`/posts/${post.id}`);
      }}
      sx={(theme) => ({
        background: 'transparent',
        cursor: 'pointer',
        '&:hover': {
          borderColor: theme.colors.pink[8],
        },
      })}
    >
      <Stack>
        <Text size="xl">{post.markdownContent}</Text>
      </Stack>
      <Group mt="sm">
        <Group spacing={8}>
          <Text color="dimmed" sx={{ lineHeight: 1 }}>
            <Avatar src={getUserAvatar(post.author)} size={16} radius="xl" />
          </Text>
          <Text size="sm" weight="bold">
            {post.profile.nickname}
          </Text>
        </Group>
        <Group spacing={8}>
          <Text color="dimmed" sx={{ lineHeight: 1 }}>
            <Calendar size={14} />
          </Text>
          <Text size="sm" color="dimmed">
            {relativeTime.from(new Date(post.createdAt))}
          </Text>
        </Group>
        <Group spacing={8}>
          <Text color="dimmed" sx={{ lineHeight: 1 }}>
            <MessageCircle size={14} />
          </Text>
          <Text size="sm" color="dimmed">
            {post.comments.length}
          </Text>
        </Group>
        {calledOut && (
          <Badge color="orange" ml="auto" variant="outline">
            Called out
          </Badge>
        )}
      </Group>
    </Card>
  );
}
