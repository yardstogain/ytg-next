import {
  Avatar,
  Card,
  Container,
  Group,
  Grid,
  Text,
  Timeline,
  Title,
} from '@mantine/core';
import { supabaseServerClient } from '@supabase/auth-helpers-nextjs';
import { PageHeader } from 'components';
import {
  currencyFormatter,
  getTeamIcon,
  relativeTime,
  renderPageTitle,
} from 'lib/utils';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { CurrencyDollar, FileUnknown, User } from 'tabler-icons-react';
import { Content } from 'types/content';
import { FraudListWinnings, FraudPicks } from 'types/football';
import { Profile } from 'types/user';

type ProfileWithContentAndFraudData = Profile & {
  content: Content[];
  fraudPicks: FraudPicks[];
  fraudListWinnings: FraudListWinnings[];
};
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { data: profile } = await supabaseServerClient(ctx)
    .from<ProfileWithContentAndFraudData>('profile')
    .select('*, content(*), fraudPicks(*), fraudListWinnings(*)')
    .match({ slug: ctx.query.user })
    .single();

  if (!profile) {
    return {
      notFound: true,
    };
  }

  return { props: { profile } };
};

type ProfileProps = {
  profile: ProfileWithContentAndFraudData;
};

export default function UserProfile({ profile }: ProfileProps) {
  const router = useRouter();

  const seasonsFraudListWinnings = profile.fraudListWinnings?.reduce(
    (acc, curr) => {
      return acc + curr.winnings;
    },
    0,
  );

  const sortedFraudPicks = profile.fraudPicks.sort((a, b) => b.week - a.week);
  const sortedContent = profile.content.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <Container size="xl">
      {renderPageTitle(`${profile.nickname} - Profile`)}
      <PageHeader
        title={profile.nickname}
        description="Presenting their Sunday best... and everything else"
        icon={<User size={48} />}
        iconColor="violet"
      />
      <Grid mt="xl" gutter="xl">
        <Grid.Col span={8}>
          <Title order={3} mb="md">
            Recent Posts
          </Title>
          {sortedContent.length > 0 ? (
            sortedContent.map((piece) => (
              <Card
                withBorder
                mb="lg"
                onClick={() => {
                  router.push(`/posts/${piece.id}`);
                }}
                sx={(theme) => ({
                  background: 'transparent',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: theme.colors.blue[8],
                  },
                })}
              >
                <Text size="lg">{piece.markdownContent}</Text>
                <Text size="sm" color="dimmed">
                  {relativeTime.from(new Date(piece.createdAt))}
                </Text>
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
                    {pick.picks.map((team) => (
                      <Avatar
                        key={team}
                        size={64}
                        src={getTeamIcon(team)}
                        radius="xl"
                        p={4}
                        mr="xs"
                        sx={(theme) => ({
                          borderWidth: 2,
                          borderColor: theme.colors.dark[4],
                          borderStyle: 'solid',
                          background: theme.colors.dark[7],
                        })}
                      />
                    ))}
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
