import React, { ReactNode } from 'react';
import { Card, Group, Title, Text, Stack, MantineColor } from '@mantine/core';

type PageHeaderProps = {
  title: string;
  description: string;
  iconColor: MantineColor;
  icon: ReactNode;
};

export function PageHeader({
  title,
  description,
  iconColor,
  icon,
}: PageHeaderProps) {
  return (
    <Card withBorder mt="xl" sx={{ background: 'transparent' }}>
      <Group spacing={0} align="flex-start" noWrap>
        <Text color={iconColor}>{icon}</Text>
        <Stack spacing={0} ml="md">
          <Title order={1} sx={{ fontFamily: 'Righteous' }}>
            {title}
          </Title>
          <Text color="dimmed" mt="sm" size="lg">
            {description}
          </Text>
        </Stack>
      </Group>
    </Card>
  );
}
