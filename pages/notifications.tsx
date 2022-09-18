import { Avatar, Container, Group, Paper, Stack, Text } from '@mantine/core';
import { NextLink } from '@mantine/next';
import {
  getUser,
  supabaseClient,
  supabaseServerClient,
  withPageAuth,
} from '@supabase/auth-helpers-nextjs';
import { useUser } from '@supabase/auth-helpers-react';
import { PageHeader } from 'components';
import { getUserAvatar, relativeTime } from 'lib/utils';
import { useEffect } from 'react';
import {
  Bell,
  ChevronRight,
  ListCheck,
  Mail,
  MailOpened,
} from 'tabler-icons-react';
import { Notification, Profile } from 'types/user';

type NotificationWithSender = Notification & {
  senderProfile: Profile;
};

export const getServerSideProps = withPageAuth({
  redirectTo: '/login?f=ar',
  async getServerSideProps(ctx) {
    const { user } = await getUser(ctx);

    const { data } = await supabaseServerClient(ctx)
      .from<NotificationWithSender>('notifications')
      .select('*, senderProfile:sender(*)')
      .match({ recipient: user.id })
      .order('createdAt', { ascending: false });

    return { props: { notifications: data } };
  },
});

function renderNotification(notification: NotificationWithSender) {
  switch (notification.type) {
    case 'call-out':
      return (
        <Paper
          component={NextLink}
          href={`/posts/${notification.contentId}`}
          p="md"
          radius={0}
          sx={(theme) => ({
            cursor: 'pointer',
            borderBottom: `1px solid ${theme.colors.gray[7]}`,
          })}
        >
          <Group spacing="lg">
            {notification.readAt ? <MailOpened /> : <Mail />}
            <Text size="lg" weight={notification.readAt ? 'normal' : 'bold'}>
              {notification.description}
            </Text>
            <Group spacing={0} ml="md">
              <Avatar
                mx="xs"
                size="sm"
                radius="xl"
                src={getUserAvatar(notification.sender)}
              />
              <Text size="md" weight="bold">
                {notification.senderProfile.nickname}
              </Text>
              <Text size="md" color="dimmed" ml="xs">
                ({notification.senderProfile.teamName})
              </Text>
            </Group>
            <Text ml="auto" color="dimmed" size="sm">
              {relativeTime.from(new Date(notification.createdAt))}
            </Text>
            <ChevronRight size={16} />
          </Group>
        </Paper>
      );
    case 'reminder':
      return (
        <Paper
          component={NextLink}
          href={`/fraud-list/picks`}
          p="md"
          radius={0}
          sx={(theme) => ({
            cursor: 'pointer',
            borderBottom: `1px solid ${theme.colors.gray[7]}`,
          })}
        >
          <Group spacing="lg">
            <ListCheck />
            <Text size="lg" weight={notification.readAt ? 'normal' : 'bold'}>
              {notification.description}
            </Text>
            <Text ml="auto" color="dimmed" size="sm">
              {relativeTime.from(new Date(notification.createdAt))}
            </Text>
            <ChevronRight size={16} />
          </Group>
        </Paper>
      );
  }
}

type NotificationsPageProps = {
  notifications: NotificationWithSender[];
};

export default function NotificationsPage({
  notifications,
}: NotificationsPageProps) {
  const { user, isLoading } = useUser();
  // mark readAt
  const unreadIds = notifications.filter((n) => !n.readAt).map((n) => n.id);
  useEffect(() => {
    async function markRead() {
      await supabaseClient
        .from<Notification>('notifications')
        .update({ readAt: 'now()' })
        .in('id', [...unreadIds]);
    }

    if (user && !isLoading) {
      markRead();
    }
  }, [user, isLoading]);

  return (
    <Container size="lg">
      <PageHeader
        title="Notifications"
        description="Don't let your fellow competittors go under the radar with their weak banter"
        icon={<Bell size={48} />}
        iconColor="yellow"
      />
      <Stack mt="xl">
        {notifications.length > 0 ? (
          notifications.map((notification) => renderNotification(notification))
        ) : (
          <Text>Nothing here</Text>
        )}
      </Stack>
    </Container>
  );
}
