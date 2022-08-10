import React from 'react';
import { Card, Group, Title, Text, Stack } from '@mantine/core';

export function PageHeader({ title, description, iconColor, icon }) {
  return (
    <Card withBorder mt="xl" sx={{ background: 'transparent' }}>
      <Group spacing={0} align="flex-start" noWrap>
        <Text color={iconColor}>{icon}</Text>
        <Stack spacing={0} ml="md">
          <Title order={1}>{title}</Title>
          <Text color="dimmed" mt="sm" size="lg">
            {description}
          </Text>
        </Stack>
      </Group>
    </Card>
  );
}
