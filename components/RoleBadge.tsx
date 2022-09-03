import { Badge } from '@mantine/core';
import { roles } from 'lib/constants';

type RoleBadgeProps = {
  role: number;
};

export function RoleBadge({ role }: RoleBadgeProps) {
  switch (role) {
    case roles.admin:
      return <Badge color="blue">Admin</Badge>;
    case roles.moderator:
      return <Badge color="green">Mod</Badge>;
    case roles.editor:
      return <Badge color="indigo">Editor</Badge>;
    case roles.subscriber:
      return <Badge color="teal">Pro</Badge>;
    case roles.banned:
      return <Badge color="red">Banned</Badge>;
    default:
      return <Badge color="gray">User</Badge>;
  }
}
