import {
  TextInput,
  PasswordInput,
  Container,
  Button,
  Card,
  Alert,
} from '@mantine/core';
import { useInputState } from '@mantine/hooks';
import { useState, useEffect } from 'react';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { useUser } from '@supabase/auth-helpers-react';
import { PageHeader } from 'components';
import { AlertCircle, Logout } from 'tabler-icons-react';
import { useRouter } from 'next/router';
import { renderPageTitle } from 'lib/utils';

export default function Login() {
  const { user } = useUser();
  const router = useRouter();
  const [email, setEmail] = useInputState('');
  const [password, setPassword] = useInputState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

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
      { redirectTo: '/' },
    );
    if (error) {
      setMessage(error.message);
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
        icon={<Logout size={48} />}
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
        <form onSubmit={handleLogin}>
          <TextInput
            label="Email"
            placeholder="you@yardstogain.com"
            value={email}
            onChange={setEmail}
            required
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            value={password}
            onChange={setPassword}
            required
            mt="md"
          />

          <Button
            type="submit"
            fullWidth
            mt="xl"
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
