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
  Paper,
  Anchor,
} from '@mantine/core';
import {
  supabaseServerClient,
  withPageAuth,
} from '@supabase/auth-helpers-nextjs';
import { PageHeader } from 'components';
import {
  csvToTeamsData,
  currencyFormatter,
  getCurrentWeek,
  getDisplayName,
  getTeamIcon,
  get,
  getFraudValueColor,
} from 'lib/utils';
import { BallAmericanFootball } from 'tabler-icons-react';
import { schedule } from 'data/schedule2022';
import { stats2021 } from 'data/stats2021';
import { NextLink } from '@mantine/next';
import Link from 'next/link';

export const getServerSideProps = withPageAuth({
  redirectTo: '/login',
  async getServerSideProps(ctx) {
    const weekData = getCurrentWeek(schedule);

    const { data, error } = await supabaseServerClient(ctx)
      .from('profile')
      .select(`id, name, nickname, teamName, fraudPicks(*)`)
      .match({ 'fraudPicks.week': weekData.week, 'fraudPicks.season': 2022 });

    return {
      props: {
        fraudPicks: data,
        currentWeek: weekData.week,
        weekStartDate: weekData.startDate.toISOString(),
      },
    };
  },
});

export default function FraudListHome({
  user,
  fraudPicks,
  currentWeek,
  weekStartDate,
}) {
  // TODO: lots of duped code
  const teamData = csvToTeamsData(stats2021);
  const teamLookup = teamData.reduce((acc, curr) => {
    return { [curr.id]: { ...curr }, ...acc };
  }, {});
  const totalWager = (picks): string => {
    const wager = picks.reduce(
      (acc, curr) => acc + teamLookup[curr].fraudValue,
      0,
    );

    return currencyFormatter.format(wager);
  };

  const mostPickedTeams = () => {
    const allPicks = fraudPicks.reduce((acc, curr) => {
      if (curr.fraudPicks.length > 0) {
        return [...acc, ...curr.fraudPicks[0].picks];
      } else {
        return acc;
      }
    }, []);

    const totalEntries = allPicks.length / 3;

    return {
      totalEntries,
      pickTotals: allPicks.reduce((acc, curr) => {
        if (acc[curr] > 0) {
          return { ...acc, [curr]: acc[curr] + 1 };
        } else {
          return { ...acc, [curr]: 1 };
        }
      }, {}),
    };
  };

  const popularPicks = mostPickedTeams();

  const percent = (num, den) => `${((num / den) * 100).toFixed(0)}%`;
  console.log('fp', fraudPicks);
  return (
    <Container size="lg">
      <PageHeader
        title="Fraud List"
        description="This description could use some work"
        icon={<BallAmericanFootball size={48} />}
        iconColor="blue"
      />

      <Title order={3} mt="xl">
        Week {currentWeek} Picks
      </Title>
      <Group spacing="md" position="apart" noWrap>
        <Table verticalSpacing="sm">
          <thead>
            <tr>
              <th>Team</th>
              <th>Picks</th>
              <th>Wager</th>
            </tr>
          </thead>
          <tbody>
            {fraudPicks.map((team) => (
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
                    <Link href={`/player/${team.nickname || team.id}`} passHref>
                      <Anchor color="dimmed">
                        {getDisplayName(
                          { name: team.name, nickname: team.nickname },
                          'No namer',
                        )}
                      </Anchor>
                    </Link>
                  </Text>
                </td>
                <td>
                  <Group spacing={0} position="left">
                    {team.fraudPicks.length > 0 ? (
                      team.fraudPicks[0].picks.map((pick) => (
                        <Avatar
                          key={pick}
                          size={48}
                          src={getTeamIcon(pick)}
                          radius="xl"
                          p={4}
                          ml={-8}
                          sx={(theme) => ({
                            borderWidth: 2,
                            borderColor:
                              theme.colors[
                                getFraudValueColor(teamLookup[pick].fraudValue)
                              ],
                            borderStyle: 'solid',
                            background: theme.colors.dark[7],
                          })}
                        />
                      ))
                    ) : (
                      <Badge>Not made</Badge>
                    )}
                  </Group>
                </td>
                <td>
                  <Text size="xl" weight={700}>
                    {team.fraudPicks.length > 0 &&
                      totalWager(team.fraudPicks[0].picks)}
                  </Text>
                </td>
              </Box>
            ))}
          </tbody>
        </Table>

        <Card withBorder shadow="md" sx={{ minWidth: 360 }}>
          <Stack spacing="sm">
            <Title order={4}>Most Picked Teams</Title>
            {/* TODO: this is very bad */}
            {Object.keys(popularPicks.pickTotals)
              .sort((a, b) => {
                return popularPicks.pickTotals[b] - popularPicks.pickTotals[a];
              })
              .map((team) => (
                <Group position="apart" key={team}>
                  <Group spacing="xs">
                    <Avatar size={24} src={getTeamIcon(team)} radius="xl" />
                    <Text size="sm">{teamLookup[team].name}</Text>
                  </Group>
                  <Text color="white" size="sm" weight={700}>
                    {percent(
                      popularPicks.pickTotals[team],
                      popularPicks.totalEntries,
                    )}
                  </Text>
                </Group>
              ))}
          </Stack>
        </Card>
      </Group>
    </Container>
  );
}
