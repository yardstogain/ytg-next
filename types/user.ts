import { User } from '@supabase/auth-helpers-nextjs';

export type { User };

export type Profile = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  nickname: string;
  teamName: string;
};
