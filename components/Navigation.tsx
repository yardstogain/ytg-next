import { useEffect, useState } from 'react';
import {
  createStyles,
  Navbar,
  Group,
  NavLink,
  Text,
  Box,
  Skeleton,
} from '@mantine/core';
import {
  Settings,
  Logout,
  Home2,
  ListCheck,
  User,
  Ladder,
  Share,
  Login,
  UserPlus,
  FilePlus,
} from 'tabler-icons-react';
import { LogoIcon } from './LogoIcon';
import { NextLink } from '@mantine/next';
import Link from 'next/link';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { Profile } from 'types/user';
import { getDisplayName } from 'lib/utils';

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef('icon');
  return {
    header: {
      padding: theme.spacing.sm,
      paddingBottom: theme.spacing.xs,
      background: theme.colors.dark[6],
      borderRadius: theme.radius.md,
      marginBottom: theme.spacing.md,
      // borderBottom: `1px solid ${
      //   theme.colorScheme === 'dark'
      //     ? theme.colors.dark[4]
      //     : theme.colors.gray[2]
      // }`,
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
  const { classes, cx } = useStyles();
  const [profile, setProfile] = useState<Profile>();
  const { user, error } = useUser();

  useEffect(() => {
    async function loadData() {
      const { data } = await supabaseClient
        .from<Profile>('profile')
        .select('*')
        .eq('id', user.id);

      if (data) {
        setProfile(data[0]);
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
            <Box component="a" mx="auto" sx={{ width: 210 }}>
              <LogoIcon.Full />
            </Box>
          </Link>
        </Group>
        <Group spacing={0} mb="md">
          {user ? (
            <>
              {profile ? (
                <Text
                  size="xs"
                  weight={700}
                  transform="uppercase"
                  color="dimmed"
                >
                  {getDisplayName(profile, 'Account')}
                </Text>
              ) : (
                <Skeleton radius="xl" height={18} width={64} />
              )}
              <NavLink
                className={classes.link}
                component={NextLink}
                href={`/player/${profile?.nickname || user.id}`}
                icon={<User className={classes.linkIcon} />}
                label="My Profile"
              />
              <NavLink
                className={classes.link}
                component={NextLink}
                href="/invite"
                icon={<Share className={classes.linkIcon} />}
                label="Invite a Friend"
                active={router.pathname.includes('/invite')}
              />
              <NavLink
                className={classes.link}
                component={NextLink}
                href="/posts/new"
                icon={<FilePlus className={classes.linkIcon} />}
                label="New Post"
                active={router.pathname === '/posts/new'}
              />
              <NavLink
                className={classes.link}
                component={NextLink}
                href="/settings"
                icon={<Settings className={classes.linkIcon} />}
                label="Settings"
                active={router.pathname === '/settings'}
              />
            </>
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
          icon={<Home2 className={classes.linkIcon} />}
          label="Home"
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
      </Navbar.Section>

      {user && (
        <Navbar.Section className={classes.footer}>
          <NavLink
            component="a"
            href="/api/auth/logout"
            className={classes.link}
            icon={<Logout className={classes.linkIcon} />}
            label="Logout"
          />
        </Navbar.Section>
      )}
    </Navbar>
  );
}
