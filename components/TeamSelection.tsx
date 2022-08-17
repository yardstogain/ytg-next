import { useEffect, useState } from 'react';
import {
  createStyles,
  Table,
  Checkbox,
  Group,
  Avatar,
  Text,
  Grid,
  Button,
  Card,
  Title,
  Anchor,
  Paper,
  Box,
} from '@mantine/core';
import {
  arraysHaveSameItems,
  currencyFormatter,
  getFraudValueColor,
  getTeamIcon,
  getTeamRecord,
  teamLookup,
} from 'lib/utils';
import { useUser } from '@supabase/auth-helpers-react';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { AlertCircle, ArrowUp, Check, InfoCircle } from 'tabler-icons-react';
import { showNotification } from '@mantine/notifications';
import { FraudPicks, Schedule } from 'types/football';
import { useRouter } from 'next/router';

const useStyles = createStyles((theme) => ({
  rowSelected: {
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.fn.rgba(theme.colors[theme.primaryColor][7], 0.2)
        : theme.colors[theme.primaryColor][0],
  },
}));

interface TeamSelectionProps {
  activeFraudPicks: FraudPicks;
  matchups: Schedule;
  teams: {
    name: string;
    wins: number;
    losses: number;
    ties: number;
    fraudValue: number;
    id: string;
  }[];
}

export function TeamSelection({
  teams,
  activeFraudPicks,
  matchups,
}: TeamSelectionProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const { classes, cx } = useStyles();
  const [selection, setSelection] = useState<string[]>([]);

  useEffect(() => {
    // If picks have been made, set the current selection to those picks
    if (activeFraudPicks.picks?.length > 0) {
      setSelection(activeFraudPicks.picks);
    }
  }, [activeFraudPicks]);

  const now = new Date();
  const weekIsLocked = now >= matchups.startDate;

  const submitFraudPicks = async () => {
    // Make sure week is not locked
    if (weekIsLocked) {
      showNotification({
        title: 'Picks locked!',
        message: 'Close those dev tools, the week is locked!',
        color: 'blue',
        icon: <InfoCircle />,
      });
    }
    // Start loading
    setLoading(true);
    if (activeFraudPicks.picks?.length > 0) {
      // update mode
      if (arraysHaveSameItems(selection, activeFraudPicks.picks)) {
        showNotification({
          title: 'Picks are the same',
          message: 'What do you think these servers grow on trees?',
          color: 'blue',
          icon: <InfoCircle />,
        });
      } else {
        const { error } = await supabaseClient
          .from('fraudPicks')
          .update({ picks: selection, updatedAt: 'now()' })
          .match({ userId: user?.id, week: matchups.week, season: 2022 });

        if (!error) {
          showNotification({
            title: 'Picks updated!',
            message: `You now have ${totalWager()} on the line`,
            color: 'teal',
            icon: <Check />,
          });
          // Refresh SSR data
          router.replace(router.asPath);
        } else {
          showNotification({
            title: 'Update failed',
            message: error.message,
            color: 'red',
            icon: <AlertCircle />,
          });
        }
      }
    } else {
      // create mode
      const { error } = await supabaseClient.from('fraudPicks').insert([
        {
          userId: user?.id,
          week: matchups.week,
          season: 2022,
          picks: selection,
        },
      ]);

      if (!error) {
        showNotification({
          title: 'Picks made!',
          message: `You put ${totalWager()} on the line`,
          color: 'teal',
          icon: <Check />,
        });
        // Refresh SSR data
        router.replace(router.asPath);
      } else {
        showNotification({
          title: 'Woopsie!',
          message: error.message,
          color: 'red',
          icon: <AlertCircle />,
        });
      }
    }
    setLoading(false);
  };

  const toggleRow = (id: string) => {
    if (selection.length < 3 || selection.includes(id)) {
      setSelection((current) =>
        current.includes(id)
          ? current.filter((team) => team !== id)
          : [...current, id],
      );
    }
  };

  const getSelectionBox = (teamSlug: string) => {
    const team = teamLookup[teamSlug];

    return (
      <Grid.Col xs={3} key={teamSlug}>
        <Card
          shadow="sm"
          withBorder
          sx={(theme) => ({
            borderColor: theme.colors[getFraudValueColor(team.fraudValue)],
          })}
        >
          <Card.Section>
            <Avatar
              size={80}
              src={getTeamIcon(teamSlug)}
              radius="xl"
              mx="auto"
            />
          </Card.Section>
          <Card.Section withBorder py="xs">
            <Text size="sm" weight={700} color="dark.0" align="center">
              {team.name}
            </Text>
            <Text color="dimmed" align="center" size="sm">
              {currencyFormatter.format(team.fraudValue)}
            </Text>
          </Card.Section>
        </Card>
      </Grid.Col>
    );
  };

  const totalWager = (): string => {
    const wager = selection.reduce(
      (acc, curr) => acc + teamLookup[curr].fraudValue,
      0,
    );

    return currencyFormatter.format(wager);
  };

  const rows = teams.map((team) => {
    const selected = selection.includes(team.id);
    const { id, name, wins, losses, ties, fraudValue } = team;
    // Find the team's matchup this week
    const matchupObj = matchups.matchups.find(
      (m) => m.home === team.id || m.away === team.id,
    );
    // If no matchup, on bye
    if (!matchupObj) {
      return null;
    }

    const opponentIsHome = matchupObj.away === team.id;
    const opponent =
      teamLookup[opponentIsHome ? matchupObj.home : matchupObj.away];

    return (
      <Box
        component="tr"
        key={id}
        className={cx({ [classes.rowSelected]: selected })}
        onClick={() => {
          if (!weekIsLocked) {
            toggleRow(id);
          }
        }}
        sx={{
          cursor: 'pointer',
        }}
      >
        <td>
          <Checkbox
            checked={selection.includes(id)}
            onChange={() => toggleRow(id)}
            transitionDuration={0}
            disabled={weekIsLocked}
          />
        </td>
        <td>
          <Group spacing="sm">
            <Avatar size={36} src={getTeamIcon(id)} radius="xl" />
            <Text size="md" weight={700}>
              {name}
            </Text>
          </Group>
        </td>
        <td>
          <Text size="md">{getTeamRecord({ wins, losses, ties })}</Text>
        </td>
        <td>
          <Group spacing={0}>
            <Text color="dimmed" weight={700}>
              {opponentIsHome ? '@' : 'vs.'}
            </Text>
            <Avatar
              size={24}
              mx="xs"
              src={getTeamIcon(opponent.id)}
              radius="xl"
            />
            <Text weight={700} color={getFraudValueColor(opponent.fraudValue)}>
              {currencyFormatter.format(opponent.fraudValue)}
            </Text>
          </Group>
        </td>
        <td>
          <Text size="xl" weight={700} color={getFraudValueColor(fraudValue)}>
            {currencyFormatter.format(fraudValue)}
          </Text>
        </td>
      </Box>
    );
  });

  return (
    <section id="your-wager">
      <Grid mt="md" align="center">
        <Grid.Col xs={3}>
          <Card shadow="sm" withBorder>
            <Title order={6}>Your wager</Title>
            <Text size={36} weight={700} align="center" color="teal">
              {totalWager()}
            </Text>
            <Button
              fullWidth
              onClick={submitFraudPicks}
              loading={loading}
              disabled={selection.length < 3 || weekIsLocked}
            >
              {weekIsLocked ? 'Locked In' : 'Submit'}
            </Button>
          </Card>
        </Grid.Col>
        {selection.map((teamSlug) => getSelectionBox(teamSlug))}
      </Grid>
      <Table verticalSpacing="sm" mt="md">
        <thead>
          <tr>
            <th></th>
            <th>Team</th>
            <th>Record</th>
            <th>Opponent</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
      <Paper mt="sm">
        <Link href="#your-wager" passHref>
          <Anchor component="a">
            <ArrowUp size={16} />
            Back to top
          </Anchor>
        </Link>
      </Paper>
    </section>
  );
}
