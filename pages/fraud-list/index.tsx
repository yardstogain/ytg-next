import {
  Avatar,
  Badge,
  Box,
  Card,
  Container,
  Group,
  Text,
  Table,
  Title,
  Stack,
  Anchor,
} from '@mantine/core';
import {
  supabaseServerClient,
  // User,
  withPageAuth,
} from '@supabase/auth-helpers-nextjs';
import { PageHeader } from 'components';
import {
  currencyFormatter,
  getCurrentWeek,
  getTeamIcon,
  getFraudValueColor,
  teamLookup,
  renderPageTitle,
} from 'lib/utils';
import { BallAmericanFootball, Trophy } from 'tabler-icons-react';
import { schedule } from 'data/schedule2022';
import Link from 'next/link';
import { Profile } from 'types/user';
import { FraudPicks, TeamSlug } from 'types/football';

type ProfileWithFraudPicks = Profile & {
  fraudPicks: FraudPicks[];
};

export const getServerSideProps = withPageAuth({
  redirectTo: '/login',
  async getServerSideProps(ctx) {
    const weekData = getCurrentWeek(schedule);

    const { data } = await supabaseServerClient(ctx)
      .from<ProfileWithFraudPicks>('profile')
      .select(`id, name, nickname, teamName, slug, fraudPicks(*)`)
      .match({
        deleted: false,
        'fraudPicks.week': weekData.week,
        'fraudPicks.season': 2022,
      });

    const now = new Date();

    return {
      props: {
        profileWithFraudPicks: data,
        currentWeek: weekData.week,
        weekLocked: now >= weekData.startDate,
      },
    };
  },
});

type FraudListHomeProps = {
  // user: User;
  profileWithFraudPicks: ProfileWithFraudPicks[];
  currentWeek: number;
  weekLocked: boolean;
};

export default function FraudListHome({
  // user,
  profileWithFraudPicks,
  currentWeek,
  weekLocked,
}: FraudListHomeProps) {
  const totalWager = (picks: TeamSlug[]): string => {
    const wager = picks.reduce(
      (acc, curr) => acc + teamLookup[curr].fraudValue,
      0,
    );

    return currencyFormatter.format(wager);
  };

  const mostPickedTeams = () => {
    const allPicks = profileWithFraudPicks.reduce((acc: string[], curr) => {
      if (curr.fraudPicks.length > 0) {
        return [...acc, ...curr.fraudPicks[0].picks];
      } else {
        return acc;
      }
    }, []);

    const totalEntries = allPicks.length / 3;

    return {
      totalEntries,
      pickTotals: allPicks.reduce((acc: Record<string, number>, curr) => {
        if (acc[curr] > 0) {
          return { ...acc, [curr]: acc[curr] + 1 };
        } else {
          return { ...acc, [curr]: 1 };
        }
      }, {}),
    };
  };

  const popularPicks = mostPickedTeams();

  const percent = (num: number, den: number) =>
    `${((num / den) * 100).toFixed(0)}%`;

  const renderPicks = (picks: TeamSlug[], team: Profile) => {
    if (weekLocked) {
      if (picks?.length > 0) {
        return picks.map((pick) => (
          <Avatar
            key={`${team.slug}-${pick}`}
            size={48}
            src={getTeamIcon(pick)}
            radius="xl"
            p={4}
            ml={-8}
            sx={(theme) => ({
              borderWidth: 2,
              borderColor:
                theme.colors[getFraudValueColor(teamLookup[pick].fraudValue)],
              borderStyle: 'solid',
              background: theme.colors.dark[7],
            })}
          />
        ));
      } else {
        return <Badge color="red">Missed Pick</Badge>;
      }
    } else {
      if (picks?.length > 0) {
        return picks.map((pick) => (
          <Avatar
            key={`${team.slug}-${pick}`}
            size={48}
            radius="xl"
            p={4}
            ml={-8}
            sx={(theme) => ({
              borderWidth: 2,
              borderColor:
                theme.colors[getFraudValueColor(teamLookup[pick].fraudValue)],
              borderStyle: 'solid',
              background: theme.colors.dark[7],
            })}
          >
            <BallAmericanFootball />
          </Avatar>
        ));
      } else {
        return <Badge>Not Made</Badge>;
      }
    }
  };

  const rows = profileWithFraudPicks.map((team) => (
    <Box component="tr" key={team.teamName}>
      <td>
        <Text size="lg" weight={700}>
          {team.teamName}
        </Text>
        <Text
          size="sm"
          color="dimmed"
          sx={{
            lineHeight: 1,
          }}
        >
          <Link href={`/player/${team.slug}`} passHref>
            <Anchor color="dimmed">{team.nickname}</Anchor>
          </Link>
        </Text>
      </td>
      <td>
        <Group spacing={0} position="left">
          {renderPicks(team.fraudPicks[0]?.picks, team)}
        </Group>
      </td>
      <td>
        <Text size="xl" weight={700}>
          {team.fraudPicks.length > 0 &&
            totalWager(team.fraudPicks[0].picks as TeamSlug[])}
        </Text>
      </td>
    </Box>
  ));

  const renderedPopularPicks = Object.keys(popularPicks.pickTotals)
    .sort((a, b) => {
      return popularPicks.pickTotals[b] - popularPicks.pickTotals[a];
    })
    .map((team, i) => (
      <Group position="apart" key={team} mt="xs">
        <Group spacing="xs">
          <Avatar size={24} src={getTeamIcon(team)} radius="xl" />
          <Text size="sm">
            {i + 1}. {teamLookup[team].name}
          </Text>
        </Group>
        <Text color="white" size="sm" weight={700}>
          {percent(popularPicks.pickTotals[team], popularPicks.totalEntries)}
        </Text>
      </Group>
    ));

  return (
    <Container size="lg">
      {renderPageTitle('Fraud List')}
      <PageHeader
        title="Fraud List League"
        description={`Just you and your ${
          profileWithFraudPicks.length - 1
        } closest friends discussing which shit teams are going to prove you right this week`}
        icon={<Trophy size={48} />}
        iconColor="yellow"
      />

      <Title order={3} mt="xl">
        Week {currentWeek} Picks
      </Title>
      <Group spacing="md" position="apart" noWrap align="flex-start">
        <Table verticalSpacing="sm">
          <thead>
            <tr>
              <th>Team</th>
              <th>Picks</th>
              <th>Wager</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
        <Stack spacing={0}>
          <Card withBorder shadow="md" sx={{ minWidth: 360 }}>
            <Stack spacing={0}>
              <Title order={4}>Most Picked Teams</Title>
              <Text color="dimmed" size="sm">
                If you're into the road most traveled.
              </Text>
            </Stack>
            {/* TODO: this is very bad */}
            {popularPicks.totalEntries > 0 ? (
              renderedPopularPicks
            ) : (
              <Badge
                size="xl"
                mt="md"
                mx="auto"
                color="yellow"
                variant="dot"
                // leftSection={<ZoomQuestion />}
              >
                No picks in yet
              </Badge>
            )}
          </Card>
        </Stack>
      </Group>
    </Container>
  );
}
