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
  Code,
} from '@mantine/core';
import { useInputState } from '@mantine/hooks';
import { useState, useEffect } from 'react';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { useUser } from '@supabase/auth-helpers-react';
import { PageHeader } from 'components';
import {
  AlertCircle,
  BallAmericanFootball,
  Check,
  Key,
  Lock,
  Mail,
  Pencil,
  User,
  UserPlus,
  Wand,
} from 'tabler-icons-react';
import { useRouter } from 'next/router';
import { betaKeys } from 'data/betaKeys';
import { renderPageTitle, validateEmail } from 'lib/utils';
import slugify from 'slugify';
import { showNotification } from '@mantine/notifications';

export default function SignUp() {
  const { user } = useUser();
  const router = useRouter();
  // Loading and error
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [checkEmail, setCheckEmail] = useState(false);
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

  useEffect(() => {
    if (typeof router.query.key === 'string') {
      setBetaKey(router.query.key);
    }
  }, [router]);

  const reset = () => {
    setErrors([]);
    setEmail('');
    setPassword('');
    setPasswordConfirm('');
    setBetaKey('');
    setName('');
    setNickname('');
    setTeamName('');
    setCheckEmail(false);
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

    setErrors([...errorCache]);
    return errorCache.length === 0;
  };

  const handleSignUp = async () => {
    setLoading(true);
    setCheckEmail(false);
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
          .update({
            name,
            nickname,
            teamName,
            betaKey,
            slug: slugify(nickname, { lower: true, strict: true }),
            updatedAt: 'now()',
          })
          .match({ id: user.id });

        if (profileError) {
          showNotification({
            title: 'Error setting profile',
            message: profileError.message,
            color: 'red',
            icon: <AlertCircle />,
          });
        }
        setCheckEmail(true);
      }
    }
    setLoading(false);
  };

  return (
    <Container size="lg">
      {renderPageTitle('Sign Up')}
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
      <form onSubmit={handleSignUp}>
        <Card withBorder shadow="md" mt="xl" sx={{ background: 'transparent' }}>
          <Title order={4}>Beta Key</Title>
          <Text color="dimmed">
            The Pool is currently in private beta, so you'll need a key to sign
            up. If you don't know where to get one, you're probably not invited.
          </Text>
          <Text color="dimmed" size="sm">
            Feel free to hit up <Code color="blue">help@thepool.app</Code> to
            complain or ask for one.
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
            description="We'll confirm this when you're done"
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
          {/* TODO: hard coded color */}
          <PasswordInput
            size="md"
            label="Confirm Password"
            description=""
            icon={
              password !== passwordConfirm ? (
                <Lock />
              ) : (
                <Check color="#099268" />
              )
            }
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
            description="This will be your Fraud List team name"
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
            description="Your personal nickname, not a team name"
            icon={<User />}
            value={nickname}
            onChange={setNickname}
            required
          />
        </Stack>

        <Card mt="xl" shadow="md" withBorder>
          {checkEmail && (
            <Alert
              icon={<Wand size={16} />}
              title="Check your email!"
              color="teal"
              mb="md"
            >
              You should have an email from us with a link to login
            </Alert>
          )}
          <Group spacing="sm">
            <Button type="submit" onClick={handleSignUp} loading={loading}>
              Create Account
            </Button>
            <Button onClick={reset} variant="subtle">
              Reset
            </Button>
          </Group>
        </Card>
      </form>
    </Container>
  );
}
