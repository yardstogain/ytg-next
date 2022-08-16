import {
  Button,
  Card,
  Container,
  Group,
  Stack,
  TextInput,
} from '@mantine/core';
import { useInputState } from '@mantine/hooks';
import {
  getUser,
  supabaseClient,
  supabaseServerClient,
  withPageAuth,
} from '@supabase/auth-helpers-nextjs';
import { PageHeader } from 'components';
import { useState } from 'react';
import {
  BallAmericanFootball,
  Pencil,
  Settings,
  User as UserIcon,
} from 'tabler-icons-react';
import { User, Profile } from 'types/user';

export const getServerSideProps = withPageAuth({
  redirectTo: '/login',
  async getServerSideProps(ctx) {
    const { user } = await getUser(ctx);

    const { data } = await supabaseServerClient(ctx)
      .from<Profile>('profile')
      .select('*')
      .eq('id', user.id)
      .limit(1);

    return { props: { profile: data?.[0] } };
  },
});

type SettingsProps = {
  user: User;
  profile: Profile;
};

export default function SettingsHome({ user, profile }: SettingsProps) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useInputState(profile.name || '');
  const [nickname, setNickname] = useInputState(profile.nickname || '');
  const [nicknameError, setNicknameError] = useState('');
  const [teamName, setTeamName] = useInputState(profile.teamName || '');

  const reset = () => {
    // Fields
    setName(profile.name);
    setNickname(profile.nickname);
    setTeamName(profile.teamName);
    // Errors
    setNicknameError('');
  };

  const validate = () => {
    // 1. nickname
    //    - 24 char max
    //    - letters, numbers, -, _
    const nicknameErrors: string[] = [];

    if (nickname.length > 24) {
      nicknameErrors.push('Too many characters');
    }

    const nickRegex = /^[a-z0-9]+(?:[_-][a-z0-9]+)*$/;
    if (!nickRegex.test(nickname)) {
      nicknameErrors.push('Only letters, numbers, hyphens, and underscores');
    }

    if (nicknameErrors.length > 0) {
      setNicknameError(nicknameErrors.join(', '));
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    setLoading(true);
    // Validate
    const valid = validate();

    if (valid) {
      const { error } = await supabaseClient
        .from('profile')
        .update({ name, nickname, teamName, updatedAt: 'now()' })
        .match({ id: user.id });

      if (error) {
        console.log('Woopsie', error);
      }
    }
    setLoading(false);
  };

  return (
    <Container size="lg">
      <PageHeader
        title="Settings"
        description="If you're not changing your team name during the season to talk shit then I don't want to know you"
        icon={<Settings size={48} />}
        iconColor="blue"
      />

      <Stack spacing="md" mt="xl" pb="xl" sx={{ width: '50%' }}>
        <TextInput
          size="md"
          label="Name"
          description="Your real name, don't be a dick"
          icon={<Pencil />}
          value={name}
          onChange={setName}
        />
        <TextInput
          size="md"
          label="Nickname"
          description="No spaces or special characters besides - and _, maximum 24 chars"
          icon={<UserIcon />}
          value={nickname}
          onChange={setNickname}
          error={nicknameError}
        />
        <TextInput
          size="md"
          label="Team Name"
          description="Live your dream"
          icon={<BallAmericanFootball />}
          value={teamName}
          onChange={setTeamName}
        />
      </Stack>
      <Card mt="xl" shadow="md" withBorder>
        <Group spacing="sm">
          <Button
            onClick={handleSave}
            loading={loading}
            disabled={
              name === profile.name &&
              nickname === profile.nickname &&
              teamName === profile.teamName
            }
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
