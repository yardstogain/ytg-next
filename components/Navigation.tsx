import { useEffect, useState } from 'react';
import {
  createStyles,
  Navbar,
  Group,
  NavLink,
  Text,
  Anchor,
  Menu,
  Avatar,
  Stack,
  Paper,
  Badge,
  Indicator,
} from '@mantine/core';
import {
  Settings,
  Logout,
  ListCheck,
  User,
  Ladder,
  Login,
  UserPlus,
  FilePlus,
  Trophy,
  LockAccess,
  Files,
  Bell,
  DotsVertical,
} from 'tabler-icons-react';
import { LogoIcon } from './LogoIcon';
import { NextLink } from '@mantine/next';
import Link from 'next/link';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { Profile, Notification } from 'types/user';
import { getUserAvatar, isAdmin } from 'lib/utils';

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef('icon');
  return {
    header: {
      // padding: theme.spacing.sm,
      paddingBottom: theme.spacing.sm,
      // background: theme.colors.dark[6],
      // borderRadius: theme.radius.md,
      marginBottom: theme.spacing.md,
      borderBottom: `1px solid ${
        theme.colorScheme === 'dark'
          ? theme.colors.dark[4]
          : theme.colors.gray[2]
      }`,
    },

    footer: {
      paddingTop: theme.spacing.md,
      marginTop: theme.spacing.md,
      borderTop: `1px solid ${
        theme.colorScheme === 'dark'
          ? theme.colors.dark[4]
          : theme.colors.gray[2]
      }`,
    },

    link: {
      ...theme.fn.focusStyles(),
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      fontSize: theme.fontSizes.sm,
      color: theme.colorScheme === 'dark' ? theme.white : theme.colors.gray[7],
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      borderRadius: theme.radius.sm,
      fontWeight: 500,

      '&:hover': {
        backgroundColor:
          theme.colorScheme === 'dark'
            ? theme.colors.dark[6]
            : theme.colors.gray[0],
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,

        [`& .${icon}`]: {
          color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        },
      },
    },

    linkIcon: {
      ref: icon,
      color:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[2]
          : theme.colors.gray[6],
      marginRight: theme.spacing.xs,
    },

    adminLinkIcon: {
      ref: icon,
      color: theme.colors.grape,
      marginRight: theme.spacing.xs,
    },

    linkActive: {
      '&, &:hover': {
        backgroundColor: theme.fn.variant({
          variant: 'light',
          color: theme.primaryColor,
        }).background,
        color: theme.fn.variant({ variant: 'light', color: theme.primaryColor })
          .color,
        [`& .${icon}`]: {
          color: theme.fn.variant({
            variant: 'light',
            color: theme.primaryColor,
          }).color,
        },
      },
    },
  };
});

export function Navigation() {
  const router = useRouter();

  const { classes } = useStyles();
  const [profile, setProfile] = useState<Profile>();
  const [notifications, setNotifications] = useState<number>(0);
  const { user } = useUser();

  useEffect(() => {
    async function loadData() {
      if (!user) return;

      const { data: profile } = await supabaseClient
        .from<Profile>('profile')
        .select('*')
        .match({ id: user.id })
        .single();

      const { count } = await supabaseClient
        .from<Notification>('notifications')
        .select('id', { count: 'exact' })
        .eq('recipient', user.id)
        .is('readAt', null);

      if (profile) {
        setProfile(profile);
      }
      if (count) {
        setNotifications(count);
      }
    }
    // Only run query once user is logged in.
    if (user) {
      loadData();
    }
  }, [user]);

  return (
    <Navbar
      height="100vh"
      width={{ sm: 300 }}
      p="md"
      sx={{
        position: 'fixed',
      }}
    >
      <Navbar.Section grow>
        <Group className={classes.header}>
          <Link href="/" passHref>
            <Anchor
              color="teal.4"
              underline={false}
              sx={{
                display: 'flex',
                alignItems: 'center',
                transition: 'color ease 0.3s',
                ':hover': {
                  color: 'white',
                },
              }}
            >
              <LogoIcon size={40} />
              <Text
                color="white"
                weight="bold"
                size={36}
                transform="uppercase"
                variant="gradient"
                gradient={{ from: 'white', to: 'gray.6' }}
                sx={{
                  fontFamily: 'Righteous',
                  marginLeft: 12,
                  letterSpacing: -0.7,
                }}
              >
                <Text
                  component="span"
                  size="md"
                  sx={{ verticalAlign: 'super' }}
                >
                  The
                </Text>
                Pool
              </Text>
            </Anchor>
          </Link>
        </Group>
        <Group spacing={0} mb="md">
          {profile ? (
            <Menu
              width={280}
              position="right-start"
              transition="pop-top-left"
              shadow="xl"
            >
              <Menu.Target>
                <Indicator
                  color="red"
                  inline
                  sx={{ width: '100%' }}
                  disabled={notifications === 0}
                >
                  <Paper
                    withBorder
                    p="sm"
                    sx={(theme) => ({
                      cursor: 'pointer',
                      ':hover': {
                        borderColor: theme.colors.blue[9],
                      },
                    })}
                  >
                    <Group spacing="sm">
                      <Avatar
                        src={getUserAvatar(profile.id)}
                        radius="xl"
                        size="md"
                      />
                      <Stack spacing={0} mr="auto">
                        <Text weight="bold">{profile.nickname}</Text>
                        <Text color="dimmed" size="sm">
                          {profile.teamName}
                        </Text>
                      </Stack>
                      <DotsVertical size={16} />
                    </Group>
                  </Paper>
                </Indicator>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label
                  sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}
                >
                  Profile
                </Menu.Label>
                <Menu.Item
                  component={NextLink}
                  href={`/notifications`}
                  icon={<Bell size={16} />}
                  rightSection={
                    notifications > 0 && (
                      <Badge color="red" variant="filled">
                        {notifications}
                      </Badge>
                    )
                  }
                >
                  Notifications
                </Menu.Item>
                <Menu.Item
                  component={NextLink}
                  href={`/player/${profile.slug}`}
                  icon={<User size={16} />}
                >
                  My Profile
                </Menu.Item>
                <Menu.Item
                  component={NextLink}
                  href="/settings"
                  icon={<Settings size={16} />}
                >
                  Settings
                </Menu.Item>
                <Menu.Divider />
                {isAdmin(profile.role) && (
                  <Menu.Item
                    component={NextLink}
                    href="/admin/dashboard"
                    color="blue"
                    icon={<LockAccess size={16} />}
                  >
                    Admin Dashboard
                  </Menu.Item>
                )}
                <Menu.Item
                  component={NextLink}
                  href="/api/auth/logout"
                  icon={<Logout size={16} />}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          ) : (
            <>
              <NavLink
                className={classes.link}
                component={NextLink}
                href="/login"
                icon={<Login className={classes.linkIcon} />}
                label="Log in"
                active={router.pathname === '/login'}
              />
              <NavLink
                className={classes.link}
                component={NextLink}
                href="/sign-up"
                icon={<UserPlus className={classes.linkIcon} />}
                label="Sign up"
                active={router.pathname === '/sign-up'}
              />
            </>
          )}
        </Group>

        <Text size="xs" weight={700} transform="uppercase" color="dimmed">
          Fraud List
        </Text>
        <NavLink
          className={classes.link}
          component={NextLink}
          href="/fraud-list"
          icon={<Trophy className={classes.linkIcon} />}
          label="League"
          active={router.pathname === '/fraud-list'}
        />
        <NavLink
          className={classes.link}
          component={NextLink}
          href="/fraud-list/picks"
          icon={<ListCheck className={classes.linkIcon} />}
          label="My Picks"
          active={router.pathname === '/fraud-list/picks'}
        />
        <NavLink
          className={classes.link}
          component={NextLink}
          href="/fraud-list/ladder"
          icon={<Ladder className={classes.linkIcon} />}
          label="Ladder"
          active={router.pathname === '/fraud-list/ladder'}
        />
        <Text
          size="xs"
          mt="md"
          weight={700}
          transform="uppercase"
          color="dimmed"
        >
          Content
        </Text>
        <NavLink
          className={classes.link}
          component={NextLink}
          href="/posts"
          icon={<Files className={classes.linkIcon} />}
          label="Recent Posts"
          active={router.pathname === '/posts'}
        />
        <NavLink
          className={classes.link}
          component={NextLink}
          href="/posts/new"
          icon={<FilePlus className={classes.linkIcon} />}
          label="New Post"
          active={router.pathname === '/posts/new'}
        />
      </Navbar.Section>
    </Navbar>
  );
}
