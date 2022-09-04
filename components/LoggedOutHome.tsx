import {
  Card,
  Group,
  Button,
  SimpleGrid,
  Title,
  List,
  Divider,
  ThemeIcon,
  Image,
  Text,
  Stack,
} from '@mantine/core';
import {
  UserPlus,
  Pool,
  ListCheck,
  Trophy,
  EqualNot,
  Check,
  HandFinger,
} from 'tabler-icons-react';
import Link from 'next/link';

export function LoggedOutHome() {
  return (
    <Stack>
      <Card
        mt={36}
        p={36}
        withBorder
        sx={{ background: 'transparent' }}
        shadow="xl"
      >
        <Group position="apart" noWrap>
          <Stack spacing={0}>
            <Text transform="uppercase" weight="bolder" color="dimmed">
              Introducing{' '}
              <Text inherit component="span">
                Fraud List
              </Text>
            </Text>
            <Text size={64} sx={{ fontFamily: 'Righteous', lineHeight: 1.25 }}>
              Start getting credit for knowing who's a{' '}
              <Text
                inherit
                component="span"
                variant="gradient"
                gradient={{ from: 'red', to: 'violet' }}
              >
                fraud
              </Text>
            </Text>
            <Text size={24} mt="xl" color="dimmed">
              Then you can stop telling your friends you "called it" and start
              showing them your Fraud List
            </Text>
            <Group mt="xl">
              <Link href="/sign-up" passHref>
                <Button
                  component="a"
                  size="lg"
                  variant="gradient"
                  leftIcon={<UserPlus />}
                  gradient={{ from: 'violet.9', to: 'violet.6' }}
                >
                  Sign up
                </Button>
              </Link>
              <Link href="/fraud-list/about" passHref>
                <Button component="a" size="lg" color="violet" variant="subtle">
                  Learn more
                </Button>
              </Link>
            </Group>
          </Stack>
          <Image src="/undraw-sports.svg" width={360} />
        </Group>
      </Card>
      <SimpleGrid cols={3} mt="xl" spacing="xl">
        <Group noWrap align="flex-start">
          <Text color="indigo">
            <Pool size={48} />
          </Text>
          <Stack spacing={0}>
            <Title order={3}>Join the Pool</Title>
            <Text color="dimmed">
              Everyone plays in one league, and can jump in at any point during
              the season.
            </Text>
          </Stack>
        </Group>
        <Group noWrap align="flex-start">
          <Text color="indigo">
            <ListCheck size={48} />
          </Text>
          <Stack spacing={0}>
            <Title order={3}>Pick Frauds</Title>
            <Text color="dimmed">
              Choose losers. The better they are, the more you get for knowing
              they're a fraud.
            </Text>
          </Stack>
        </Group>
        <Group noWrap align="flex-start">
          <Text color="indigo">
            <Trophy size={48} />
          </Text>
          <Stack spacing={0}>
            <Title order={3}>Achieve Glory</Title>
            <Text color="dimmed">
              Once you've won, your competitors will know they were frauds this
              whole time.
            </Text>
          </Stack>
        </Group>
      </SimpleGrid>
      <Divider my="xl" id="learn-more" />
      <SimpleGrid cols={2} spacing="xl">
        <Stack spacing={0}>
          <Text weight="bold" size={24}>
            What's Different?
          </Text>
          <Text color="dimmed" mb="md">
            There has to be a point to all of this right?
          </Text>
          <List
            size="lg"
            spacing="md"
            icon={
              <ThemeIcon color="cyan" radius="xl">
                <EqualNot size={16} />
              </ThemeIcon>
            }
          >
            <List.Item>No spreads, just losers</List.Item>
            <List.Item>No cop outs with a minimum wager</List.Item>
            <List.Item>
              Get in any time, you'll just miss previous weeks' earnings
            </List.Item>
            <List.Item>
              Call your friends out with posts and comments, visible to everyone
            </List.Item>
            <List.Item>
              Catch a hot streak and multiply your earnings every week
            </List.Item>
          </List>
        </Stack>
        <Stack spacing={0}>
          <Text weight="bold" size={24}>
            What's the Same?
          </Text>
          <Text color="dimmed" mb="md">
            But not too different, Jesus...
          </Text>
          <List
            size="lg"
            spacing="md"
            icon={
              <ThemeIcon color="green" radius="xl">
                <Check size={16} />
              </ThemeIcon>
            }
          >
            <List.Item>
              Still don't have to watch anything besides Redzone
            </List.Item>
            <List.Item>When you're wrong it still feels bad</List.Item>
            <List.Item>Which will be frequent</List.Item>
            <List.Item>The website will break from time to time</List.Item>
            <List.Item>Arguments over settings you don't control</List.Item>
          </List>
        </Stack>
      </SimpleGrid>
      <Card
        mt={36}
        p={36}
        withBorder
        sx={{ background: 'transparent', textAlign: 'center' }}
        shadow="xl"
      >
        <Text
          size={24}
          mb="xl"
          sx={{ fontFamily: 'Righteous', lineHeight: 1.25 }}
        >
          Enough foreplay...
        </Text>
        <Link href="/sign-up" passHref>
          <Button
            leftIcon={<HandFinger size={24} />}
            component="a"
            color="yellow"
            size="xl"
          >
            Let's Go!
          </Button>
        </Link>
      </Card>
    </Stack>
  );
}
