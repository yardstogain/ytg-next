import { useEffect, useState } from 'react';
import {
  createStyles,
  Navbar,
  Group,
  NavLink,
  Text,
  Skeleton,
  Anchor,
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
} from 'tabler-icons-react';
import { LogoIcon } from './LogoIcon';
import { NextLink } from '@mantine/next';
import Link from 'next/link';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { Profile } from 'types/user';
import { isAdmin } from 'lib/utils';

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
  const { user } = useUser();

  useEffect(() => {
    async function loadData() {
      if (!user) return;

      const { data } = await supabaseClient
        .from<Profile>('profile')
        .select('*')
        .match({ id: user.id })
        .single();

      if (data) {
        setProfile(data);
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
          {user ? (
            <>
              {profile ? (
                <Text
                  size="xs"
                  weight={700}
                  transform="uppercase"
                  color="dimmed"
                >
                  {profile.nickname}
                </Text>
              ) : (
                <Skeleton radius="xl" height={18} width={64} />
              )}
              <NavLink
                className={classes.link}
                component={NextLink}
                href={`/player/${profile?.slug}`}
                icon={<User className={classes.linkIcon} />}
                label="My Profile"
              />
              {/* <NavLink
                className={classes.link}
                component={NextLink}
                href="/invite"
                icon={<Share className={classes.linkIcon} />}
                label="Invite a Friend"
                active={router.pathname.includes('/invite')}
              /> */}
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
      {user && (
        <Navbar.Section className={classes.footer}>
          {profile && isAdmin(profile.role) && (
            <NavLink
              className={classes.link}
              component={NextLink}
              href="/admin/dashboard"
              icon={<LockAccess className={classes.linkIcon} />}
              label="Admin"
              active={router.pathname.includes('/admin')}
            />
          )}
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
