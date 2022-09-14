import {
  Avatar,
  Card,
  Container,
  Group,
  Grid,
  Text,
  Timeline,
  Title,
  Stack,
} from '@mantine/core';
import { NextLink } from '@mantine/next';
import { getUser, supabaseServerClient } from '@supabase/auth-helpers-nextjs';
import { MarkdownContent, RoleBadge } from 'components';
import { schedule } from 'data/schedule2022';
import {
  currencyFormatter,
  getTeamIcon,
  getUserAvatar,
  relativeTime,
  renderPageTitle,
} from 'lib/utils';
import { GetServerSideProps } from 'next';
import {
  BallAmericanFootball,
  Calendar,
  CurrencyDollar,
  FileUnknown,
  Ladder,
  MessageCircle,
} from 'tabler-icons-react';
import { ContentWithComments } from 'types/content';
import {
  FraudListResults,
  FraudListWinnings,
  FraudPicks,
} from 'types/football';
import { Profile } from 'types/user';

type ProfileWithContentAndFraudData = Profile & {
  content: ContentWithComments[];
  fraudPicks: FraudPicks[];
  fraudListWinnings: FraudListWinnings[];
};
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { user } = await getUser(ctx);

  const { data: profile } = await supabaseServerClient(ctx)
    .from<ProfileWithContentAndFraudData>('profile')
    .select('*, content(*, comments(id)), fraudPicks(*), fraudListWinnings(*)')
    .match({ slug: ctx.query.user })
    .single();

  if (!profile) {
    return {
      notFound: true,
    };
  }

  const { data: fraudListResults } = await supabaseServerClient(ctx)
    .from<FraudListResults>('fraudListResults')
    .select('*');

  const viewingOwnProfile = user?.id === profile.id;

  return {
    props: { profile, fraudListResults, viewingOwnProfile },
  };
};

type ProfileProps = {
  profile: ProfileWithContentAndFraudData;
  fraudListResults: FraudListResults[];
  viewingOwnProfile: boolean;
};

export default function UserProfile({
  profile,
  fraudListResults,
  viewingOwnProfile,
}: ProfileProps) {
  const seasonsFraudListWinnings = profile.fraudListWinnings?.reduce(
    (acc, curr) => {
      return acc + curr.winnings;
    },
    0,
  );

  const sortedFraudPicks = profile.fraudPicks.sort((a, b) => a.week - b.week);
  const sortedContent = profile.content.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <Container size="lg">
      {renderPageTitle(`${profile.nickname} - Profile`)}
      <Group spacing={0} mt="xl">
        <Avatar src={getUserAvatar(profile.id)} mr="md" radius="xl" size={64} />
        <Stack spacing={0}>
          <Group spacing={0}>
            <Text size={48} sx={{ fontFamily: 'Righteous' }}>
              {profile.nickname}
            </Text>
          </Group>
          <Group spacing="md">
            <Group spacing={8}>
              <Ladder size={16} />
              <Text size="sm" color="dimmed">
                {profile.teamName}
              </Text>
            </Group>
            <RoleBadge role={profile.role} />
          </Group>
        </Stack>
      </Group>
      <Grid mt="xl" gutter="xl">
        <Grid.Col span={8}>
          <Title order={3} mb="md">
            Recent Posts
          </Title>
          {sortedContent.length > 0 ? (
            sortedContent.map((piece) => (
              <Card
                withBorder
                key={piece.id}
                mb="lg"
                pt={0}
                component={NextLink}
                href={`/posts/${piece.id}`}
                sx={(theme) => ({
                  background: 'transparent',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: theme.colors.blue[8],
                  },
                })}
              >
                <MarkdownContent content={piece.markdownContent} />
                <Group>
                  <Group spacing={8} mt="sm">
                    <Text color="dimmed" sx={{ lineHeight: 1 }}>
                      <Calendar size={14} />
                    </Text>
                    <Text size="sm" color="dimmed">
                      {relativeTime.from(new Date(piece.createdAt))}
                    </Text>
                  </Group>
                  <Group spacing={8} mt="sm">
                    <Text color="dimmed" sx={{ lineHeight: 1 }}>
                      <MessageCircle size={14} />
                    </Text>
                    <Text size="sm" color="dimmed">
                      {piece.comments.length}
                    </Text>
                  </Group>
                </Group>
              </Card>
            ))
          ) : (
            <Card withBorder sx={{ background: 'transparent' }}>
              <Group spacing="sm">
                <Text component="span" color="dark.3" sx={{ lineHeight: 1 }}>
                  <FileUnknown size={24} />
                </Text>
                <Text color="dimmed">No posts yet</Text>
              </Group>
            </Card>
          )}
        </Grid.Col>
        <Grid.Col span={4}>
          <Title order={3} mb="md">
            2022 Fraud Picks
          </Title>
          {sortedFraudPicks.length > 0 ? (
            <Timeline lineWidth={2} bulletSize={32}>
              {sortedFraudPicks.map((pick) => (
                <Timeline.Item
                  key={pick.id}
                  pl={36}
                  bullet={
                    <Avatar radius="xl" size={30} color="blue">
                      {pick.week}
                    </Avatar>
                  }
                >
                  <Group spacing={0} mb="xs">
                    {pick.picks.map((team) => {
                      const weekLosers = fraudListResults.find(
                        (result) => result.week === pick.week,
                      )?.losers;

                      const now = new Date();
                      const itemWeek = schedule.find(
                        (x) => x.week === pick.week,
                      );
                      const weekLocked = itemWeek && itemWeek.startDate <= now;

                      return (
                        <Avatar
                          key={team}
                          size={64}
                          src={
                            weekLocked || viewingOwnProfile
                              ? getTeamIcon(team)
                              : null
                          }
                          radius="xl"
                          p={4}
                          mr="xs"
                          sx={(theme) => ({
                            borderWidth: 2,
                            borderColor: weekLosers?.includes(team)
                              ? theme.colors.teal[8]
                              : theme.colors.dark[4],
                            borderStyle: 'solid',
                            background: theme.colors.dark[7],
                          })}
                        >
                          <BallAmericanFootball size={36} />
                        </Avatar>
                      );
                    })}
                  </Group>
                  <Text weight="bold" color="dimmed">
                    Earned{' '}
                    {currencyFormatter.format(
                      profile.fraudListWinnings.find(
                        (week) => week.week === pick.week,
                      )?.winnings || 0,
                    )}
                  </Text>
                </Timeline.Item>
              ))}
              <Timeline.Item bullet={<CurrencyDollar size={20} />} pl={36}>
                <Text size="sm" weight="bold">
                  Total Winnings
                </Text>
                <Text weight="bold" color="teal" size="xl">
                  {currencyFormatter.format(seasonsFraudListWinnings)}
                </Text>
              </Timeline.Item>
            </Timeline>
          ) : (
            <Card withBorder sx={{ background: 'transparent' }}>
              <Group spacing="sm">
                <Text component="span" color="dark.3" sx={{ lineHeight: 1 }}>
                  <FileUnknown size={24} />
                </Text>
                <Text color="dimmed">No picks this season</Text>
              </Group>
            </Card>
          )}
        </Grid.Col>
      </Grid>
    </Container>
  );
}
