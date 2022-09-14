import {
  Anchor,
  Avatar,
  Box,
  Container,
  Group,
  Stack,
  Table,
  Text,
} from '@mantine/core';
import {
  supabaseServerClient,
  withPageAuth,
} from '@supabase/auth-helpers-nextjs';
import { PageHeader } from 'components';
import { schedule } from 'data/schedule2022';
import {
  currencyFormatter,
  getCurrentWeek,
  getLadderColor,
  getTeamIcon,
  renderPageTitle,
} from 'lib/utils';
import Link from 'next/link';
import { Crown, Ladder, Trophy } from 'tabler-icons-react';
import { FraudListWinnings, FraudPicks, TeamSlug } from 'types/football';
import { Profile } from 'types/user';

type UserWithFraudData = Profile & {
  fraudPicks: FraudPicks[];
  fraudListWinnings: FraudListWinnings[];
};

export const getServerSideProps = withPageAuth({
  redirectTo: '/login?f=ar',
  async getServerSideProps(ctx) {
    // const { user } = await getUser(ctx);
    const currentWeekNumber = getCurrentWeek(schedule).week;

    const { data: usersWithFraudData } = await supabaseServerClient(ctx)
      .from<UserWithFraudData>('profile')
      .select('*, fraudPicks(*), fraudListWinnings(*)');

    return { props: { usersWithFraudData, currentWeekNumber } };
  },
});

type LadderPageProps = {
  usersWithFraudData: UserWithFraudData[];
  currentWeekNumber: number;
};

export default function LadderPage({
  usersWithFraudData,
  currentWeekNumber,
}: LadderPageProps) {
  const sortedData = usersWithFraudData
    .map((user) => {
      const totalWinnings = user.fraudListWinnings.reduce((acc, curr) => {
        // TODO: season
        if (curr.season === 2022) {
          return acc + curr.winnings;
        }
        return acc;
      }, 0);
      return { ...user, totalWinnings };
    })
    // .filter((team) => team.totalWinnings > 0)
    .sort((a, b) => b.totalWinnings - a.totalWinnings);

  return (
    <Container size="lg">
      {renderPageTitle('Ladder - Fraud List')}
      <PageHeader
        title="Fraud Ladder"
        description="Consider this the social hierarchy of the world"
        icon={<Ladder size={48} />}
        iconColor="indigo"
      />
      <Table verticalSpacing="xs" mt="xl">
        <thead>
          <tr>
            <th>Player</th>
            <th>Most Targeted</th>
            <th style={{ textAlign: 'right' }}>Weekly Avg.</th>
            <th style={{ textAlign: 'right' }}>Total Winnings</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((user, idx) => {
            // TODO: wont scale, season
            const mostPicked = user.fraudPicks.reduce<TeamSlug[]>(
              (acc, curr) => {
                if (curr.season === 2022 && curr.week < currentWeekNumber) {
                  return [...acc, ...curr.picks];
                }
                return acc;
              },
              [],
            );

            return (
              <Box
                component="tr"
                key={user.id}
                py={0}
                sx={(theme) => ({
                  borderBottom:
                    idx === 2
                      ? `2px solid ${theme.colors.gray[7]}`
                      : `1px solid ${theme.colors.gray[9]}`,
                })}
              >
                <td>
                  <Group spacing={0}>
                    <Box sx={{ width: idx < 3 ? 64 : 32 }}>
                      <Text
                        size={idx < 3 ? 40 : 24}
                        weight="bold"
                        color={getLadderColor(idx + 1)}
                        align="right"
                      >
                        {idx === 0 && <Crown size={32} />}
                        {idx < 3 && idx > 0 && <Trophy size={24} />}
                        {idx + 1}
                      </Text>
                    </Box>
                    <Stack spacing={0} ml="sm" my="sm">
                      <Text size="lg" weight={700}>
                        {user.teamName}
                      </Text>
                      <Text
                        size="sm"
                        color="dimmed"
                        sx={{
                          lineHeight: 1,
                        }}
                      >
                        <Link href={`/player/${user.slug}`} passHref>
                          <Anchor color="dimmed">{user.nickname}</Anchor>
                        </Link>
                      </Text>
                    </Stack>
                  </Group>
                </td>
                <td>
                  <Group spacing={0}>
                    {mostPicked.map((team) => (
                      <Avatar
                        key={team}
                        size={48}
                        src={getTeamIcon(team)}
                        radius="xl"
                        p={4}
                        ml={-8}
                        sx={(theme) => ({
                          borderWidth: 2,
                          borderColor: theme.colors.dark[4],
                          borderStyle: 'solid',
                          background: theme.colors.dark[7],
                        })}
                      />
                    ))}
                  </Group>
                </td>
                <td align="right">
                  <Text
                    size={idx < 3 ? 36 : 24}
                    weight="bolder"
                    color={
                      user.totalWinnings / user.fraudPicks.length > 0
                        ? 'teal'
                        : 'red'
                    }
                  >
                    {currencyFormatter.format(
                      user.totalWinnings / user.fraudPicks.length,
                    )}
                  </Text>
                </td>
                <td align="right">
                  <Text
                    size={idx < 3 ? 36 : 24}
                    weight="bolder"
                    color={user.totalWinnings > 0 ? 'teal' : 'red'}
                  >
                    {currencyFormatter.format(user.totalWinnings)}
                  </Text>
                </td>
              </Box>
            );
          })}
        </tbody>
      </Table>
      {sortedData.length === 0 && (
        <Text size="lg" mt="lg" color="dimmed" align="center">
          Check back when week 1 is done!
        </Text>
      )}
    </Container>
  );
}
