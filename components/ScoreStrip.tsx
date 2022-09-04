import { Card, Group, ScrollArea, Text } from '@mantine/core';
import { relativeTime } from 'lib/utils';

type ESPNTeam = {
  abbreviation: string;
};

type Competition = {
  competitors: Competitor[];
  date: string;
  status: {
    displayClock: string;
    period: number;
  };
};

type Competitor = {
  homeAway: 'home' | 'away';
  score: string;
  team: ESPNTeam;
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
              sx={{ width: 100 }}
            >
              <Group position="apart">
                <Text size="xs" weight="bold">
                  {away?.team.abbreviation}{' '}
                  <Text
                    component="span"
                    size={10}
                    color="gray.7"
                    sx={{ verticalAlign: 'text-bottom' }}
                  >
                    @
                  </Text>
                </Text>
                <Text size="xs" color="dimmed">
                  {away?.score}
                </Text>
              </Group>
              <Group position="apart">
                <Text size="xs" weight="bold">
                  {home?.team.abbreviation}
                </Text>
                <Text size="xs" color="dimmed">
                  {home?.score}
                </Text>
              </Group>
              <Text size="xs" color="dimmed">
                {comp.status.period === 0
                  ? relativeTime.from(new Date(comp.date))
                  : `${comp.status.displayClock} Q${comp.status.period}`}
              </Text>
            </Card>
          );
        })}
      </Group>
    </ScrollArea>
  );
}
