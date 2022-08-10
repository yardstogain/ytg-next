import * as Avatar from '@radix-ui/react-avatar';
import * as Popover from '@radix-ui/react-popover';
import { StarFilledIcon, PersonIcon } from '@radix-ui/react-icons';
import { Auth } from '@supabase/ui';
import { styled } from '../stitches.config';
import { Box } from './Box';
import { isLoggedIn } from '../lib/utils';
import Link from 'next/link';
import { useUser } from '@supabase/auth-helpers-react';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';

const StyledAvatar = styled(Avatar.Root, {
  square: 48,
  mr: '$2',
});

const StyledImage = styled(Avatar.Image, {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: '$normal',
});

const Fallback = styled(Avatar.Fallback, {
  fontSize: '$4',
  fontWeight: '$bold',
  borderRadius: '$normal',
  backgroundColor: '$sage9',
  square: 48,
  br: '$normal',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const Trigger = styled(Popover.Trigger, {
  m: '$0',
  p: '$1',
  background: 'transparent',
  border: '$none',
  br: '$normal',
  color: '$sage12',
  position: 'relative',
  cursor: 'pointer',
  transition: '$normal',
  fontFamily: 'inherit',
  '&:hover': {
    background: '$blue3',
  },
});

const Content = styled(Popover.Content, {
  background: '$sage3',
  br: '$normal',
  p: '$2',
  boxShadow: '$popover',
  width: '240px',
});

const Arrow = styled(Popover.Arrow, {
  fill: '$sage3',
});

const Username = styled('span', {
  fontSize: '$3',
  fontWeight: '$bold',
  color: '$blue9',
  '& > svg': {
    mr: '$1',
  },
});

const Rank = styled('span', {
  position: 'relative',
  textAlign: 'left',
  fontSize: '$5',
  fontWeight: '$light',
  mt: '$1',
  '& > svg': {
    mr: '$1',
    color: '$amber9',
  },
});

const LinkList = styled('ul', {
  listStyleType: 'none',
  m: '$0',
  p: '$0',
});

const LinkItem = styled('li', {
  m: '$0',
  p: '$0',
  '& > a': {
    color: '$sage12',
    textDecoration: 'none',
    fontSize: '$3',
  },
});

function UserInfoButton() {
  const { user } = useUser();
  const now = new Date();
  const avatarBucket =
    'https://frvypfdkmdsottjcsvay.supabase.co/storage/v1/object/public/avatars';
  console.log({ user });
  return (
    // TODO: a11y and animate
    <Popover.Root>
      <Trigger>
        <Box
          css={{
            display: 'flex',
          }}
        >
          <StyledAvatar>
            <StyledImage
              src={`${avatarBucket}/${user?.id}.jpeg?t=${now.toISOString()}`}
              width={48}
              height={48}
            />

            <Fallback>
              <PersonIcon />
            </Fallback>
          </StyledAvatar>
          <Box
            css={{
              display: 'flex',
              alignItems: 'center',
              m: '0 $2 0 $1',
            }}
          >
            <Box
              css={{
                display: 'flex',
                justifyContent: 'flex-start',
                flexDirection: 'column',
              }}
            >
              <Username>{user?.email}</Username>
              <Rank>
                <StarFilledIcon />
                1417
              </Rank>
            </Box>
          </Box>
        </Box>
      </Trigger>
      {/* <Popover.Anchor /> */}
      <Content>
        <Arrow />
        {isLoggedIn(user) ? (
          <LinkList>
            <LinkItem>
              <Link href="/user">Profile</Link>
            </LinkItem>
            <LinkItem>
              <Link href="/logout">Logout</Link>
            </LinkItem>
          </LinkList>
        ) : (
          <Auth supabaseClient={supabaseClient} />
        )}
      </Content>
    </Popover.Root>
  );
}

export { UserInfoButton };
