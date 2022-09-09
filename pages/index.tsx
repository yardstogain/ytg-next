import {
  Container,
  Stack,
  Title,
  Grid,
  Card,
  Button,
  Badge,
  Text,
  Group,
  Avatar,
  Loader,
} from '@mantine/core';
import {
  getUser,
  supabaseServerClient,
  User,
} from '@supabase/auth-helpers-nextjs';
import {
  currencyFormatter,
  getCurrentWeek,
  getTeamIcon,
  getTotalWager,
  renderPageTitle,
  teamLookup,
} from 'lib/utils';
import { GetServerSideProps } from 'next';
import { LoggedOutHome, PostCard, ScoreStrip } from 'components';
import { FullContent } from 'types/content';
import { Profile } from 'types/user';
import Link from 'next/link';
import { CalendarStats, FilePlus, List, ListCheck } from 'tabler-icons-react';
import { schedule } from 'data/schedule2022';
import { FraudPicks } from 'types/football';
import { useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { user } = await getUser(ctx);

  const currentWeek = getCurrentWeek(schedule);
  const now = new Date();

  const { data: profile } = await supabaseServerClient(ctx)
    .from<Profile>('profile')
    .select('*')
    .match({ id: user?.id })
    .single();

  const { data: activeFraudPicks } = await supabaseServerClient(ctx)
    .from<FraudPicks>('fraudPicks')
    .select('*')
    // TODO: season
    .match({ week: currentWeek.week, season: 2022, userId: user?.id })
    .single();

  const { data: content } = await supabaseServerClient(ctx)
    .from<FullContent>('content')
    .select('*, comments(id), profile(*)')
    .order('createdAt', { ascending: false })
    .limit(5);

  const scoreStrip = await (
    await fetch(
      'http://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard',
    )
  ).json();

  return {
    props: {
      user,
      profile,
      activeFraudPicks,
      content,
      scoreStrip,
      currentWeekNumber: currentWeek.week,
      weekLocked: now >= currentWeek.startDate,
    },
  };
};

type IndexProps = {
  user?: User;
  profile: Profile;
  activeFraudPicks: FraudPicks;
  content: FullContent[];
  scoreStrip: any;
  currentWeekNumber: number;
  weekLocked: boolean;
};

export function LoggedInHome({
  profile,
  activeFraudPicks,
  content,
  scoreStrip,
  currentWeekNumber,
  weekLocked,
}: IndexProps) {
  return (
    <Stack spacing={0} mt="xl">
      <Group position="apart">
        <Group spacing="sm">
          <Text component="span" color="yellow" sx={{ lineHeight: 1 }}>
            <CalendarStats size={32} />
          </Text>
          <Title order={2} sx={{ fontFamily: 'Righteous', fontSize: 40 }}>
            Week {currentWeekNumber}
          </Title>
        </Group>
        <ScoreStrip data={scoreStrip} />
      </Group>
      <Grid mt="lg">
        <Grid.Col span={6}>
          <Group position="apart">
            <Stack spacing={0} mb="md">
              <Title order={3}>This Week's Fraud List</Title>
              <Text color="dimmed" size="sm" sx={{ lineHeight: 1 }}>
                {activeFraudPicks
                  ? 'Always time to tweak those picks'
                  : `Don't forget to pick your frauds`}
              </Text>
            </Stack>
            <Link href="/fraud-list/picks" passHref>
              <Button
                component="a"
                leftIcon={<ListCheck size={16} />}
                variant="subtle"
                color="gray"
              >
                Go to Picks
              </Button>
            </Link>
          </Group>
          <Card withBorder shadow="lg">
            {weekLocked && (
              <Badge color="red" variant="outline" mb="md">
                Week Locked
              </Badge>
            )}

            {activeFraudPicks ? (
              <>
                <Text size="lg" mb="md">
                  This is what you're going with.
                </Text>
                <Stack
                  spacing="xs"
                  pb="sm"
                  sx={(theme) => ({
                    borderBottom: `1px solid ${theme.colors.gray[7]}`,
                  })}
                >
                  {activeFraudPicks.picks.map((pick) => {
                    const team = teamLookup[pick];
                    return (
                      <Group key={pick}>
                        <Avatar size={36} src={getTeamIcon(pick)} radius="xl" />
                        <Text weight="bold">{team.name}</Text>
                        <Text color="teal" weight="bold" ml="auto">
                          {currencyFormatter.format(team.fraudValue)}
                        </Text>
                      </Group>
                    );
                  })}
                </Stack>
                <Group position="apart" mt="sm">
                  <Text weight="bold" color="dimmed">
                    Total Wager
                  </Text>
                  <Text color="teal" weight="bold">
                    {currencyFormatter.format(
                      getTotalWager(activeFraudPicks.picks),
                    )}
                  </Text>
                </Group>
              </>
            ) : (
              <>
                <Text size="lg" mb="lg">
                  The quickest path to a fat L is forgetting to submit your
                  picks.
                </Text>
                <Link href="/fraud-list/picks" passHref>
                  <Button
                    component="a"
                    size="lg"
                    variant="gradient"
                    gradient={{ from: 'cyan', to: 'violet' }}
                    leftIcon={<ListCheck size={16} />}
                    fullWidth
                  >
                    My Picks
                  </Button>
                </Link>
              </>
            )}
          </Card>
        </Grid.Col>

        <Grid.Col span={6}>
          <Group position="apart">
            <Stack spacing={0} mb="md">
              <Title order={3}>Recent Posts</Title>
              <Text color="dimmed" size="sm" sx={{ lineHeight: 1 }}>
                The musings of local singles near you
              </Text>
            </Stack>
            <Link href="/posts" passHref>
              <Button
                component="a"
                leftIcon={<List size={16} />}
                variant="subtle"
                color="gray"
              >
                View more
              </Button>
            </Link>
          </Group>
          {content.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              calledOut={post.playerTags.includes(profile.id)}
            />
          ))}
          <Card withBorder shadow="lg">
            <Link href="/posts/new" passHref>
              <Button
                component="a"
                variant="gradient"
                gradient={{ from: 'pink', to: 'orange' }}
                leftIcon={<FilePlus size={16} />}
                fullWidth
              >
                New Post
              </Button>
            </Link>
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

export default function Index({
  profile,
  activeFraudPicks,
  content,
  scoreStrip,
  currentWeekNumber,
  weekLocked,
  user,
}: IndexProps) {
  const router = useRouter();
  const { user: clientUser, isLoading } = useUser();

  useEffect(() => {
    console.log('in UE');
    if (clientUser && !isLoading && !user) {
      console.log('in cond', clientUser, user);
      router.reload();
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <Stack align="center" justify="center" sx={{ height: '70vh' }}>
        <Loader size={100} />
      </Stack>
    );
  }

  console.log(scoreStrip);

  return (
    <>
      {renderPageTitle('Home')}
      {user ? (
        <Container size="lg">
          <LoggedInHome
            profile={profile}
            activeFraudPicks={activeFraudPicks}
            content={content}
            scoreStrip={scoreStrip}
            currentWeekNumber={currentWeekNumber}
            weekLocked={weekLocked}
          />
        </Container>
      ) : (
        <Container size="xl">
          <LoggedOutHome />
        </Container>
      )}
    </>
  );
}
