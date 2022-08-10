import { useState } from 'react';
import {
  createStyles,
  Table,
  Checkbox,
  Group,
  Avatar,
  Text,
  Container,
  Grid,
  Button,
  Card,
  Skeleton,
  Title,
  Anchor,
  Paper,
  Stack,
  Box,
} from '@mantine/core';
import { arraysHaveSameItems, getTeamIcon, getTeamRecord } from 'lib/utils';
import { useUser } from '@supabase/auth-helpers-react';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { ArrowBackUp, ArrowUp, ListCheck } from 'tabler-icons-react';

const useStyles = createStyles((theme) => ({
  rowSelected: {
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.fn.rgba(theme.colors[theme.primaryColor][7], 0.2)
        : theme.colors[theme.primaryColor][0],
  },
}));

interface TeamSelectionProps {
  teams: {
    name: string;
    wins: number;
    losses: number;
    ties: number;
    fraudValue: number;
    id: string;
  }[];
}

export function TeamSelection({ teams, activeFraudPicks }: TeamSelectionProps) {
  const { user } = useUser();
  const { classes, cx } = useStyles();
  const [selection, setSelection] = useState<string[]>([
    ...activeFraudPicks.picks,
  ]);

  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const teamLookup = teams.reduce((acc, curr) => {
    return { [curr.id]: { ...curr }, ...acc };
  }, {});

  const submitFraudPicks = async () => {
    if (selection.length !== 3) {
      console.log('ya gotta make 3 picks my guy');
    } else {
      if (activeFraudPicks) {
        // update mode
        if (arraysHaveSameItems(selection, activeFraudPicks.picks)) {
          console.log('picks are same, not updating');
        } else {
          console.log('updating picks');
          const { data, error } = await supabaseClient
            .from('fraud-picks')
            .update({ picks: selection, updated_at: 'now()' })
            .match({ user_id: user?.id, week: 7, season: 2021 });
          console.log('done updating', data, error);
        }
      } else {
        // create mode
        console.log('making picks');
        const { data, error } = await supabaseClient
          .from('fraud-picks')
          .insert([
            { user_id: user?.id, week: 7, season: 2021, picks: selection },
          ]);
        console.log('done creating', data, error);
      }
    }
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

  const getFraudValueColor = (fraudValue: number): string => {
    if (fraudValue > 95) return 'teal';
    if (fraudValue > 40) return 'lime';
    if (fraudValue < 0) return 'red';
    return 'yellow';
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
              {formatter.format(team.fraudValue)}
            </Text>
          </Card.Section>
        </Card>
      </Grid.Col>
    );
  };

  const totalWager = (): number => {
    const wager = selection.reduce(
      (acc, curr) => acc + teamLookup[curr].fraudValue,
      0,
    );

    return formatter.format(wager);
  };

  const rows = teams.map((team, i) => {
    const selected = selection.includes(team.id);
    const { id, name, wins, losses, ties, fraudValue } = team;

    const opponentIdx = Math.floor(Math.random() * 32);
    const opponent = teams[opponentIdx];

    return (
      <Box
        component="tr"
        key={id}
        className={cx({ [classes.rowSelected]: selected })}
        onClick={() => {
          toggleRow(id);
        }}
        sx={(theme) => ({
          cursor: 'pointer',
        })}
      >
        <td>
          <Checkbox
            checked={selection.includes(id)}
            onChange={() => toggleRow(id)}
            transitionDuration={0}
          />
        </td>
        <td>
          <Group spacing="sm">
            <Avatar size={36} src={getTeamIcon(id)} radius="xl" />
            <Text size="md" weight={700}>
              {i + 1}. {name}
            </Text>
          </Group>
        </td>
        <td>
          <Text size="md">{getTeamRecord({ wins, losses, ties })}</Text>
        </td>
        <td>
          <Group spacing="sm">
            <Avatar size={24} src={getTeamIcon(opponent.id)} radius="xl" />
            <Text weight={700} color={getFraudValueColor(opponent.fraudValue)}>
              {formatter.format(opponent.fraudValue)}
            </Text>
          </Group>
        </td>
        <td>
          <Text size="xl" weight={700} color={getFraudValueColor(fraudValue)}>
            {formatter.format(fraudValue)}
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
              disabled={totalWager() <= 0 || selection.length < 3}
            >
              Submit
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
            <th>vs.</th>
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
