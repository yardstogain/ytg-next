import {
  TextInput,
  PasswordInput,
  Container,
  Button,
  Card,
  Alert,
  Anchor,
} from '@mantine/core';
import { useInputState } from '@mantine/hooks';
import { useState, useEffect } from 'react';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { useUser } from '@supabase/auth-helpers-react';
import { PageHeader } from 'components';
import { AlertCircle, Login, UserExclamation, Wand } from 'tabler-icons-react';
import { useRouter } from 'next/router';
import { renderPageTitle } from 'lib/utils';
import { NextLink } from '@mantine/next';

export default function LoginPage() {
  const { user } = useUser();
  const router = useRouter();
  const [email, setEmail] = useInputState('');
  const [password, setPassword] = useInputState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [checkEmail, setCheckEmail] = useState(false);

  useEffect(() => {
    if (user) {
      router.replace('/');
    }
  }, [user]);

  const handleLogin = async () => {
    setLoading(true);
    setMessage('');
    // {user, error}
    const { error } = await supabaseClient.auth.signIn(
      {
        email,
        password,
      },
      { redirectTo: '/', shouldCreateUser: false },
    );

    if (error) {
      setMessage(error.message);
    } else {
      if (password.length === 0) {
        setCheckEmail(true);
      }
    }

    // if (!error) {
    //   router.replace('/');
    // }
    setLoading(false);
  };

  return (
    <Container size="lg">
      {renderPageTitle('Log in')}
      <PageHeader
        title="Log in"
        description="To play games, acquire bragging rights, and ruin your next family dinner, you'll need to log in."
        icon={<Login size={48} />}
        iconColor="yellow"
      />
      <Card
        withBorder
        shadow="md"
        p="lg"
        mt={120}
        mx="auto"
        sx={{
          width: 480,
        }}
      >
        {message && (
          <Card.Section mb="md" withBorder>
            <Alert
              icon={<AlertCircle size={16} />}
              title="Woopsie!"
              color="red"
              radius={0}
            >
              {message}
            </Alert>
          </Card.Section>
        )}
        {router.query.f === 'ar' && (
          <Alert
            icon={<UserExclamation size={16} />}
            title="That needs an account"
            color="yellow"
            mb="md"
          >
            You need to be logged in to access that page.{' '}
            <Anchor component={NextLink} href="/sign-up">
              Sign up
            </Anchor>{' '}
            today to get started!
          </Alert>
        )}
        {checkEmail ? (
          <Alert
            icon={<Wand size={16} />}
            title="Check your email!"
            color="teal"
            mb="md"
          >
            You should have an email from us with a link to login
          </Alert>
        ) : (
          <Alert
            icon={<Wand size={16} />}
            title="No Password Required!"
            color="blue"
            mb="md"
          >
            Leave the password field blank and you'll get an email with a link
            to log you in
          </Alert>
        )}
        <form onSubmit={handleLogin}>
          <TextInput
            label="Email"
            placeholder="you@thepool.app"
            value={email}
            onChange={setEmail}
            size="md"
            required
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            value={password}
            onChange={setPassword}
            size="md"
            mt="md"
          />

          <Button
            type="submit"
            fullWidth
            mt="xl"
            size="md"
            onClick={handleLogin}
            loading={loading}
          >
            Log in
          </Button>
        </form>
      </Card>
    </Container>
  );
}
