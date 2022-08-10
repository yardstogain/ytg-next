import {
  Container,
  Avatar,
  Group,
  Text,
  Menu,
  NavLink,
  ActionIcon,
} from '@mantine/core';
import { useState, useEffect } from 'react';
import { Logout, Settings, ChevronRight, Login } from 'tabler-icons-react';
import { LogoIcon } from './LogoIcon';
import { useUser } from '@supabase/auth-helpers-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NextLink } from '@mantine/next';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { getUserAvatar } from 'lib/utils';
import { Navigation } from './Navigation';

type Profile = {
  name: string;
};

export function Header() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | {}>({});
  const { user, error } = useUser();

  useEffect(() => {
    async function loadData() {
      const { data } = await supabaseClient.from('profile').select('*');
      setProfile(data[0]);
    }
    // Only run query once user is logged in.
    if (user) loadData();
  }, [user]);

  return (
    <div>
      <Container>
        <Group position="apart">
          <Menu withArrow width={300} position="bottom" transition="pop">
            <Menu.Target>
              <ActionIcon>Menu!</ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              {user ? (
                <>
                  <Menu.Item rightSection={<ChevronRight size={14} />}>
                    <Group>
                      <Avatar
                        radius="xl"
                        color="cyan"
                        src={getUserAvatar(user.id)}
                      >
                        {profile.name?.slice(0, 1).toUpperCase()}
                      </Avatar>
                      <div>
                        <Text weight={500}>{profile.name}</Text>
                        <Text size="xs" color="dimmed">
                          {user.email}
                        </Text>
                      </div>
                    </Group>
                  </Menu.Item>

                  <Menu.Divider />
                  <Menu.Label>Account</Menu.Label>
                  <Menu.Item
                    icon={<Settings size={14} />}
                    component={NextLink}
                    href="/profile"
                  >
                    Settings
                  </Menu.Item>
                  <Menu.Item
                    icon={<Logout size={14} />}
                    component={NextLink}
                    href="/api/auth/logout"
                  >
                    Logout
                  </Menu.Item>
                </>
              ) : (
                <>
                  <Menu.Item
                    icon={<Login size={14} />}
                    component={NextLink}
                    href="login"
                  >
                    Log in
                  </Menu.Item>
                </>
              )}
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Container>
      <Container>
        <Link href="/" passHref>
          <NavLink
            component="a"
            label="Home"
            active={router.pathname === '/'}
          />
        </Link>

        <Link href="/fraud-list" passHref>
          <NavLink
            component="a"
            label="Fraud List"
            active={router.pathname === '/fraud-list'}
          />
        </Link>

        <Link href="/fraud-list/picks" passHref>
          <NavLink
            component="a"
            label="Make Fraud List Picks"
            active={router.pathname === '/fraud-list/picks'}
          />
        </Link>
      </Container>
    </div>
  );
}
