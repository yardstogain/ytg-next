import {
  Card,
  Container,
  Group,
  NumberInput,
  Stack,
  Title,
  Text,
  Button,
  Alert,
  Avatar,
  UnstyledButton,
  Radio,
} from '@mantine/core';
import {
  getUser,
  supabaseClient,
  supabaseServerClient,
  withPageAuth,
} from '@supabase/auth-helpers-nextjs';
import { Profile } from 'types/user';
import { AdminTabs } from 'components';
import { schedule } from 'data/schedule2022';
import {
  getCurrentWeek,
  getTeamIcon,
  teamLookup,
  currencyFormatter,
  calculateFraudListWinnings,
  isAdmin,
} from 'lib/utils';
import { useState } from 'react';
import { FraudListWinnings, FraudPicks, TeamSlug } from 'types/football';
import { AlertCircle, Check, InfoCircle } from 'tabler-icons-react';
import { showNotification } from '@mantine/notifications';

export const getServerSideProps = withPageAuth({
  redirectTo: '/login',
  async getServerSideProps(ctx) {
    const { user } = await getUser(ctx);

    const { data: selfRole } = await supabaseServerClient(ctx)
      .from<Profile>('profile')
      .select('role')
      .match({ id: user.id })
      .single();

    if (selfRole && !isAdmin(selfRole.role)) {
      return {
        notFound: true,
      };
    }

    return {
      props: {},
    };
  },
});

export default function AdminFraudList() {
  const currentWeek = getCurrentWeek(schedule);

  const [loading, setLoading] = useState(false);
  const [week, setWeek] = useState(currentWeek.week);
  const [selectedLosers, setSelectedLosers] = useState<TeamSlug[]>([]);

  const totalWeeks = schedule.length;
  const selectedWeek = schedule.find((sked) => sked.week === week);

  const reset = () => {
    setSelectedLosers([]);
  };

  const handleSave = async () => {
    setLoading(true);
    let errorWhileUpdating = false;
    // Upsert results
    const { error: upsertError } = await supabaseClient
      .from('fraudListResults')
      .upsert({ week: week, season: 2022, losers: selectedLosers });

    // For each fraud pick, assign each picker's points
    const { data: fraudPicks } = await supabaseClient
      .from<FraudPicks>('fraudPicks')
      .select('*');

    if (fraudPicks) {
      fraudPicks.forEach(async (picks) => {
        const winnings = calculateFraudListWinnings(
          picks.picks,
          selectedLosers,
        );

        const { error: updateError } = await supabaseClient
          .from<FraudListWinnings>('fraudListWinnings')
          .upsert({ userId: picks.userId, season: 2022, week, winnings });

        if (updateError) {
          errorWhileUpdating = true;
        }
      });
    }

    if (!upsertError && !errorWhileUpdating) {
      showNotification({
        title: 'Results saved!',
        message: 'Good show old boy',
        color: 'teal',
        icon: <Check />,
      });
    } else {
      console.log(upsertError);
    }

    setLoading(false);
  };

  return (
    <Container size="lg">
      <AdminTabs />
      <Stack mt="xl" sx={{ width: '68%', minWidth: 688 }}>
        <Title order={3}>Fraud List Results</Title>
        <Card withBorder sx={{ background: 'transparent' }}>
          {/* TODO: update to a select of the valid weeks */}
          <NumberInput
            size="md"
            description="Submit game results for this week"
            defaultValue={currentWeek.week}
            label="Select week"
            max={totalWeeks}
            min={1}
            value={week}
            onChange={(value) => {
              if (value) {
                setWeek(value);
                setSelectedLosers([]);
              }
            }}
          />
          {week > currentWeek.week && (
            <Alert
              mt="md"
              icon={<AlertCircle size={16} />}
              title="Careful!"
              color="red"
            >
              The week you're looking at is in the future, don't get wild.
            </Alert>
          )}
        </Card>
        <Alert title="Info" color="blue" icon={<InfoCircle size={16} />}>
          Select the teams that lost this week. This is a very MVP version of
          this tool, so don't fuck it up.
        </Alert>
      </Stack>

      <Stack mt="lg">
        {selectedWeek?.matchups.map((matchup) => (
          <Group key={`${matchup.away}-at-${matchup.home}`}>
            <Radio.Group onChange={() => {}}>
              <UnstyledButton
                onClick={() => {
                  if (!selectedLosers.includes(matchup.away)) {
                    // Clicked team not in list, add it and remove the other team
                    setSelectedLosers([
                      matchup.away,
                      ...selectedLosers.filter((team) => team !== matchup.home),
                    ]);
                  } else {
                    setSelectedLosers([
                      ...selectedLosers.filter((team) => team !== matchup.away),
                    ]);
                  }
                }}
                sx={(theme) => ({
                  borderRadius: theme.radius.md,
                  border: `1px solid ${
                    selectedLosers.includes(matchup.away)
                      ? theme.colors.red[8]
                      : theme.colors.gray[8]
                  }`,
                  padding: theme.spacing.lg,
                  flexDirection: 'row',
                  display: 'flex',
                  alignItems: 'center',
                  width: 320,
                })}
              >
                <Avatar
                  size={48}
                  mx="xs"
                  src={getTeamIcon(matchup.away)}
                  radius="xl"
                />
                <Stack spacing={0}>
                  <Text weight="bold">{teamLookup[matchup.away].name}</Text>
                  <Text color="dimmed" size="sm">
                    {currencyFormatter.format(
                      teamLookup[matchup.away].fraudValue,
                    )}
                  </Text>
                </Stack>
              </UnstyledButton>
              <Text size="xl" color="gray.7" weight="bold">
                @
              </Text>
              <UnstyledButton
                onClick={() => {
                  if (!selectedLosers.includes(matchup.home)) {
                    // Clicked team not in list, add it and remove the other team
                    setSelectedLosers([
                      matchup.home,
                      ...selectedLosers.filter((team) => team !== matchup.away),
                    ]);
                  } else {
                    setSelectedLosers([
                      ...selectedLosers.filter((team) => team !== matchup.home),
                    ]);
                  }
                }}
                sx={(theme) => ({
                  borderRadius: theme.radius.md,
                  border: `1px solid ${
                    selectedLosers.includes(matchup.home)
                      ? theme.colors.red[8]
                      : theme.colors.gray[8]
                  }`,
                  padding: theme.spacing.lg,
                  flexDirection: 'row',
                  display: 'flex',
                  alignItems: 'center',
                  width: 320,
                })}
              >
                <Avatar
                  size={48}
                  mx="xs"
                  src={getTeamIcon(matchup.home)}
                  radius="xl"
                />
                <Stack spacing={0}>
                  <Text weight="bold">{teamLookup[matchup.home].name}</Text>
                  <Text color="dimmed" size="sm">
                    {currencyFormatter.format(
                      teamLookup[matchup.home].fraudValue,
                    )}
                  </Text>
                </Stack>
              </UnstyledButton>
            </Radio.Group>
          </Group>
        ))}
      </Stack>

      <Card mt="xl" shadow="md" withBorder>
        <Group spacing="sm">
          <Button
            onClick={handleSave}
            loading={loading}
            disabled={selectedLosers.length !== selectedWeek?.matchups.length}
          >
            Save
          </Button>
          <Button onClick={reset} variant="subtle">
            Reset
          </Button>
        </Group>
      </Card>
    </Container>
  );
}
