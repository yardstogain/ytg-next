import { Container } from '@mantine/core';
import { PageHeader } from 'components';
import { Ladder } from 'tabler-icons-react';

export default function LadderPage() {
  return (
    <Container size="lg">
      <PageHeader
        title="Fraud Ladder"
        description="heyo"
        icon={<Ladder size={48} />}
        iconColor="indigo"
      />
    </Container>
  );
}
