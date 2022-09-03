import { ReactNode } from 'react';
import { Paper, Group, Text, MantineColor } from '@mantine/core';

type AdminStatProps = {
  title: string;
  description: string;
  stat: number | string;
  icon: ReactNode;
  accent: MantineColor;
};

export function AdminStat({
  title,
  description,
  stat,
  icon,
  accent,
}: AdminStatProps) {
  return (
    <Paper withBorder p="md" radius="md">
      <Group position="apart">
        <Text size="xs" color="dimmed" transform="uppercase" weight="bold">
          {title}
        </Text>
        <Text component="span" color={accent}>
          {icon}
        </Text>
      </Group>

      <Group align="flex-end" spacing="xs" mt="sm">
        <Text size={32} weight="bolder">
          {stat}
        </Text>
      </Group>

      <Text size="xs" color="dimmed" mt={4}>
        {description}
      </Text>
    </Paper>
  );
}
