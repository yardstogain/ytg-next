import { Avatar, Card, Group, ScrollArea, Text } from '@mantine/core';
import { getTeamIcon, relativeTime, reverseAbbrLookup } from 'lib/utils';
import { BallAmericanFootball } from 'tabler-icons-react';

type ESPNTeam = {
  abbreviation: string;
};

type Competition = {
  competitors: Competitor[];
  date: string;
  situation?: {
    isRedZone: boolean;
    possession: Competitor['id'];
  };
  status: {
    displayClock: string;
    period: number;
    type: {
      name:
        | 'STATUS_IN_PROGRESS'
        | 'STATUS_SCHEDULED'
        | 'STATUS_END_PERIOD'
        | 'STATUS_HALFTIME'
        | 'STATUS_Final';
      shortDetail: string;
    };
  };
};

type Competitor = {
  homeAway: 'home' | 'away';
  score: string;
  team: ESPNTeam;
  id: string;
};

type ESPNEvent = {
  id: string;
  competitions: Competition[];
};

type ESPNData = {
  events: ESPNEvent[];
};

type ScoreStripProps = {
  data: ESPNData;
};
export function ScoreStrip({ data }: ScoreStripProps) {
  if (!data) {
    return <Text>ESPN broke the data I was stealing</Text>;
  }

  return (
    <ScrollArea style={{ maxWidth: '70%' }}>
      <Group spacing="xs" noWrap>
        {data.events.map((event) => {
          const comp = event.competitions[0];

          const home = comp.competitors.find((c) => c.homeAway === 'home');
          const away = comp.competitors.find((c) => c.homeAway === 'away');

          return (
            <Card
              withBorder
              key={event.id}
              px={8}
              pb={0}
              pt={4}
              sx={(theme) => ({
                width: 100,
                borderColor: comp.situation?.isRedZone
                  ? theme.colors.red[8]
                  : comp.status.type.name === 'STATUS_IN_PROGRESS'
                  ? theme.colors.blue[7]
                  : theme.colors.gray[8],
              })}
            >
              <Group position="apart">
                <Group spacing={4}>
                  <Avatar
                    size={16}
                    radius="xl"
                    src={
                      away?.team.abbreviation
                        ? getTeamIcon(
                            reverseAbbrLookup[away?.team.abbreviation],
                          )
                        : ''
                    }
                  />
                  <Text size="xs" weight="bold">
                    {away?.team.abbreviation}{' '}
                    {comp.situation?.possession === away?.id && (
                      <BallAmericanFootball
                        color="rgba(255,255,255,0.5)"
                        size={12}
                        style={{ marginBottom: -2 }}
                      />
                    )}
                  </Text>
                </Group>
                <Text size="xs" color="dimmed">
                  {away?.score}
                </Text>
              </Group>
              <Group position="apart">
                <Group spacing={4}>
                  <Avatar
                    size={16}
                    radius="xl"
                    src={
                      home?.team.abbreviation
                        ? getTeamIcon(
                            reverseAbbrLookup[home?.team.abbreviation],
                          )
                        : ''
                    }
                  />
                  <Text size="xs" weight="bold">
                    {home?.team.abbreviation}{' '}
                    {comp.situation?.possession === home?.id && (
                      <BallAmericanFootball
                        color="rgba(255,255,255,0.5)"
                        size={12}
                        style={{ marginBottom: -2 }}
                      />
                    )}
                  </Text>
                </Group>
                <Text size="xs" color="dimmed">
                  {home?.score}
                </Text>
              </Group>
              <Text size="xs" color="dimmed">
                {comp.status.type.name === 'STATUS_SCHEDULED'
                  ? relativeTime.from(new Date(comp.date))
                  : comp.status.type.shortDetail}
              </Text>
            </Card>
          );
        })}
      </Group>
    </ScrollArea>
  );
}
