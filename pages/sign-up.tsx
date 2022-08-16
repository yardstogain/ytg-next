import {
  TextInput,
  PasswordInput,
  Container,
  Button,
  Card,
  Alert,
  Text,
  Stack,
  Group,
  Title,
  List,
} from '@mantine/core';
import { useInputState } from '@mantine/hooks';
import { useState, useEffect } from 'react';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { useUser } from '@supabase/auth-helpers-react';
import { PageHeader } from 'components';
import {
  AlertCircle,
  BallAmericanFootball,
  Key,
  Lock,
  Mail,
  Pencil,
  User,
  UserPlus,
} from 'tabler-icons-react';
import { useRouter } from 'next/router';
import { betaKeys } from 'data/betaKeys';
import { validateEmail, validateNickname } from 'lib/utils';

export default function SignUp() {
  const { user } = useUser();
  const router = useRouter();
  // Loading and error
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  // Fields
  const [email, setEmail] = useInputState('');
  const [password, setPassword] = useInputState('');
  const [passwordConfirm, setPasswordConfirm] = useInputState('');
  const [betaKey, setBetaKey] = useInputState('');

  const [name, setName] = useInputState('');
  const [nickname, setNickname] = useInputState('');
  const [teamName, setTeamName] = useInputState('');

  useEffect(() => {
    if (user) {
      router.replace('/');
    }
  }, [user]);

  const reset = () => {
    setErrors([]);
    setEmail('');
    setPassword('');
    setPasswordConfirm('');
    setBetaKey('');
    setName('');
    setNickname('');
    setTeamName('');
  };

  const addError = (message: string) => {
    setErrors([...errors, message]);
  };

  const validate = () => {
    setErrors([]);
    const errorCache = [];
    // 1. Check beta key
    if (!betaKeys[betaKey]) {
      errorCache.push('Invalid beta key');
    }
    // 2. Check Password match
    if (password !== passwordConfirm) {
      errorCache.push(`Passwords don't match`);
    }
    // 2b. Password min length
    if (password.length < 6) {
      errorCache.push('Password should be at least 6 characters');
    }
    // 3. Check email format
    if (!validateEmail(email)) {
      errorCache.push(`Email isn't real`);
    }
    // 4. Check nickname format
    if (nickname.length > 0 && !validateNickname(nickname)) {
      errorCache.push(`Follow the nickname rules`);
    }
    setErrors([...errorCache]);
    return errorCache.length === 0;
  };

  const handleSignUp = async () => {
    setLoading(true);
    setErrors([]);

    const isValid = validate();

    if (isValid) {
      // {user, error, session}
      const { error, user } = await supabaseClient.auth.signUp(
        {
          email,
          password,
        },
        { redirectTo: '/' },
      );
      // Add server error if needed
      if (error) {
        addError(error.message);
      }
      // Fill profile data
      if (user) {
        const { error: profileError } = await supabaseClient
          .from('profile')
          .update({ name, nickname, teamName, betaKey, updatedAt: 'now()' })
          .match({ id: user.id });

        if (profileError) {
          console.log('There was an error updating profile', profileError);
        }
      }
    }
    setLoading(false);
  };

  return (
    <Container size="lg">
      <PageHeader
        title="Sign Up"
        description="Welcome to the first day of the rest of your season"
        icon={<UserPlus size={48} />}
        iconColor="grape"
      />

      {errors.length > 0 && (
        <Alert
          icon={<AlertCircle size={16} />}
          title="Woopsie!"
          color="red"
          mt="xl"
        >
          <Text weight={700}>
            There were some issues you'll need to sort out.
          </Text>
          <List size="sm">
            {errors.map((error, i) => (
              <List.Item key={i}>{error}</List.Item>
            ))}
          </List>
        </Alert>
      )}

      <Card withBorder shadow="md" mt="xl" sx={{ background: 'transparent' }}>
        <Title order={4}>Beta Key</Title>
        <Text color="dimmed">
          Yards to Gain is currently in private beta, so you'll need a key to
          sign up. If you don't know where to get one, you're probably not
          invited.
        </Text>
        <Stack spacing={0} sx={{ width: '50%' }}>
          <TextInput
            mt="md"
            size="lg"
            label="Key"
            icon={<Key />}
            value={betaKey}
            onChange={setBetaKey}
            required
          />
        </Stack>
      </Card>

      <Stack spacing="md" mt="xl" pb="xl" sx={{ width: '50%' }}>
        <Title order={3}>Account Info</Title>
        <TextInput
          size="md"
          label="Email"
          description="We'll only spam you when we want"
          icon={<Mail />}
          value={email}
          onChange={setEmail}
          required
        />
        <PasswordInput
          size="md"
          label="Password"
          description="Minimum 6 characters. Make sure to write this down somewhere."
          icon={<Lock />}
          value={password}
          onChange={setPassword}
          required
        />
        <PasswordInput
          size="md"
          label="Confirm Password"
          description=""
          icon={<Lock />}
          value={passwordConfirm}
          onChange={setPasswordConfirm}
          required
        />
      </Stack>
      <Stack spacing="md" mt="xl" pb="xl" sx={{ width: '50%' }}>
        <Title order={3}>Profile Info</Title>
        <TextInput
          size="md"
          label="Team Name"
          description="Live your dream"
          icon={<BallAmericanFootball />}
          value={teamName}
          onChange={setTeamName}
          required
        />
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
          icon={<User />}
          value={nickname}
          onChange={setNickname}
        />
      </Stack>
      <Card mt="xl" shadow="md" withBorder>
        <Group spacing="sm">
          <Button onClick={handleSignUp} loading={loading}>
            Create Account
          </Button>
          <Button onClick={reset} variant="subtle">
            Reset
          </Button>
        </Group>
      </Card>
    </Container>
  );
}
