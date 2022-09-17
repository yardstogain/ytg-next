import { Tabs } from '@mantine/core';
import { useRouter } from 'next/router';
import { File, LockAccess, Trophy, User } from 'tabler-icons-react';

export function AdminTabs() {
  const router = useRouter();

  const iconSize = 16;

  return (
    <Tabs
      mt="xl"
      value={router.asPath as string}
      onTabChange={(value) => {
        router.push(`${value}`);
      }}
    >
      <Tabs.List>
        <Tabs.Tab
          value="/admin/dashboard"
          icon={<LockAccess size={iconSize} />}
        >
          Dashboard
        </Tabs.Tab>
        <Tabs.Tab value="/admin/fraud-list" icon={<Trophy size={iconSize} />}>
          Fraud List
        </Tabs.Tab>
        <Tabs.Tab value="/admin/content" icon={<File size={iconSize} />}>
          Content
        </Tabs.Tab>
        <Tabs.Tab value="/admin/users" icon={<User size={iconSize} />}>
          User Management
        </Tabs.Tab>
      </Tabs.List>
    </Tabs>
  );
}
