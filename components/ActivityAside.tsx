import { styled } from '../stitches.config';
import { Text } from './Text';

const HollowCard = styled('div', {
  p: '$3',
  br: '$normal',
  borderColor: '$sage4',
  borderWidth: '$thin',
  borderStyle: '$solid',
  width: '100%',
  mb: '$3',
});

function ActivityAside() {
  return (
    <>
      <HollowCard>
        <Text.Eyebrow>cats!</Text.Eyebrow>
        heypo
      </HollowCard>
      <HollowCard>
        <Text.Eyebrow>cats!</Text.Eyebrow>
        heypo
      </HollowCard>
    </>
  );
}

export { ActivityAside };
